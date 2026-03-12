import { NextRequest, NextResponse } from "next/server";
import type { Resource } from "@/types/resource";
import { checkRateLimit, getIp, rateLimiters } from "@/lib/ratelimit";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(rateLimiters.resourcesSubmit, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, link, description } = body as Record<string, unknown>;

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedLink = typeof link === "string" ? link.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";

    if (!trimmedTitle || !trimmedLink || !trimmedDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      new URL(trimmedLink);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const pat = process.env.GITHUB_PAT;
    if (!pat) {
      console.error("GITHUB_PAT is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const resource: Resource = {
      id: slugify(trimmedTitle),
      title: trimmedTitle,
      link: trimmedLink,
      description: trimmedDescription,
    };

    const dispatchResponse = await fetch(
      "https://api.github.com/repos/Claude-Builder-Club/asucbc/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${pat}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "add-resource",
          client_payload: resource,
        }),
      }
    );

    if (!dispatchResponse.ok) {
      const errorText = await dispatchResponse.text();
      console.error("GitHub dispatch error", dispatchResponse.status, errorText);
      return NextResponse.json({ error: "Failed to dispatch event" }, { status: 500 });
    }

    return NextResponse.json({ message: "Resource submitted for review" }, { status: 200 });
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
