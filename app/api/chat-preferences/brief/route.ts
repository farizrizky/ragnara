import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const preferenceId = "default";
const minTemperature = 0;
const maxTemperature = 0.8;

const defaultPreference = {
  name: "Assistant",
  tone: "Clear, concise, helpful",
  streamSpeed: "NORMAL",
  openingLine: "Hello! How can I help today?",
  temperature: 0.4,
};

function clampTemperature(value: number) {
  return Math.min(Math.max(value, minTemperature), maxTemperature);
}

function buildBriefPrompt(preference: {
  name: string;
  tone: string;
  streamSpeed: string;
  openingLine: string;
  temperature: number;
}) {
  return [
    "You are a chat assistant configuration brief.",
    `Assistant name: ${preference.name}.`,
    `Language style: ${preference.tone}.`,
    `Stream speed: ${preference.streamSpeed}.`,
    `Opening line: ${preference.openingLine}.`,
    `Temperature: ${preference.temperature}.`,
    "Keep responses aligned with the configuration above.",
  ].join(" " );
}

async function buildOpeningMessage(preference: {
  name: string;
  tone: string;
  streamSpeed: string;
  openingLine: string;
  temperature: number;
}) {
  const openingHint = preference.openingLine.trim();
  const userPrompt = openingHint
    ? `Write one short opening line using this hint: "${openingHint}".`
    : "Write one short opening line that greets the user.";

  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature: clampTemperature(preference.temperature),
    messages: [
      { role: "system", content: buildBriefPrompt(preference) },
      {
        role: "user",
        content: `${userPrompt} Return only the line.`,
      },
    ],
  });

  return text.trim();
}

export async function GET() {
  const preference = await prisma.chatPreference.findUnique({
    where: { id: preferenceId },
  });

  const resolved = {
    name: preference?.name ?? defaultPreference.name,
    tone: preference?.tone ?? defaultPreference.tone,
    streamSpeed: preference?.streamSpeed ?? defaultPreference.streamSpeed,
    openingLine: preference?.openingLine ?? defaultPreference.openingLine,
    temperature: preference?.temperature ?? defaultPreference.temperature,
  };

  const prompt = buildBriefPrompt(resolved);
  let openingMessage = "";

  try {
    openingMessage = await buildOpeningMessage(resolved);
  } catch {
    const fallback = resolved.openingLine.trim();
    openingMessage = fallback
      ? `${fallback} - ${resolved.name}`
      : `Hello! I'm ${resolved.name}.`;
  }

  return NextResponse.json({ prompt, preference: resolved, openingMessage });
}
