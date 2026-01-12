import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const preferenceId = "default";
const minTemperature = 0;
const maxTemperature = 0.8;
const defaultTemperature = 0.4;

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function clampTemperature(value: number) {
  return Math.min(Math.max(value, minTemperature), maxTemperature);
}

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: ChatMessage[];
  };

  let temperature = defaultTemperature;

  try {
    const preference = await prisma.chatPreference.findUnique({
      where: { id: preferenceId },
    });
    if (preference?.temperature !== undefined) {
      temperature = clampTemperature(preference.temperature);
    }
  } catch {
    temperature = defaultTemperature;
  }

  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature,
    messages,
  });

  return NextResponse.json({ text });
}
