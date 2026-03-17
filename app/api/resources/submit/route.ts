import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { resourceSubmissions } from "@/lib/db/schema";
import { checkRateLimit, getIp, rateLimiters } from "@/lib/ratelimit";

interface ResourceSubmission {
  title: string;
  link: string;
  description: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getTextField = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const parseSubmission = (value: unknown): ResourceSubmission | null => {
  if (!isRecord(value)) {
    return null;
  }

  return {
    title: getTextField(value.title),
    link: getTextField(value.link),
    description: getTextField(value.description),
  };
};

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(rateLimiters.resourcesSubmit, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const submission = parseSubmission(body);
    if (!submission) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!submission.title || !submission.link || !submission.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      new URL(submission.link);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    await getDb().insert(resourceSubmissions).values({
      title: submission.title,
      link: submission.link,
      description: submission.description,
    });

    return NextResponse.json({ message: "Resource submitted" }, { status: 200 });
  } catch (error) {
    console.error("Resource submission error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
