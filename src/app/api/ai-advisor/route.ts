import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { system, messages } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${res.status}`, details: err },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? "No response from AI.";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to reach AI service", details: e.message },
      { status: 502 }
    );
  }
}
