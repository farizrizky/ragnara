import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const preferenceId = "default";

const allowedSpeeds = new Set(["INSTANT", "SLOW", "FAST", "NORMAL"]);
const minTemperature = 0;
const maxTemperature = 0.8;

type PreferencePayload = {
  name?: string;
  tone?: string;
  streamSpeed?: string;
  openingLine?: string;
  temperature?: number;
};

function clampTemperature(value: number) {
  return Math.min(Math.max(value, minTemperature), maxTemperature);
}

export async function GET() {
  const preference = await prisma.chatPreference.findUnique({
    where: { id: preferenceId },
  });

  return NextResponse.json({ preference });
}

export async function POST(request: Request) {
  const body = (await request.json()) as PreferencePayload;

  const name = (body.name ?? "").trim();
  const tone = (body.tone ?? "").trim();
  const openingLine = (body.openingLine ?? "").trim();
  const streamSpeed = body.streamSpeed ?? "NORMAL";
  const rawTemperature = typeof body.temperature === "number" ? body.temperature : 0.4;
  const temperature = clampTemperature(rawTemperature);

  if (!allowedSpeeds.has(streamSpeed)) {
    return NextResponse.json(
      { error: "Invalid stream speed." },
      { status: 400 },
    );
  }

  const preference = await prisma.chatPreference.upsert({
    where: { id: preferenceId },
    update: { name, tone, openingLine, streamSpeed, temperature },
    create: { id: preferenceId, name, tone, openingLine, streamSpeed, temperature },
  });

  return NextResponse.json({ preference });
}
