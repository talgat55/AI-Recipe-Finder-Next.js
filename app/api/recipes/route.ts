import { NextRequest, NextResponse } from "next/server";
import { generateRecipes } from "@/services/ai";

/**
 * Validate POST body: we expect { ingredients: string }.
 * Reject empty or too-short input so we don't call AI or return meaningless results.
 */
const MIN_INGREDIENTS_LENGTH = 2;

function validateBody(body: unknown): { ingredients: string } | null {
  if (!body || typeof body !== "object" || !("ingredients" in body)) return null;
  const ingredients =
    typeof (body as { ingredients?: unknown }).ingredients === "string"
      ? (body as { ingredients: string }).ingredients.trim()
      : "";
  if (ingredients.length < MIN_INGREDIENTS_LENGTH) return null;
  return { ingredients };
}

/**
 * In-memory rate limit: one request per IP per window. Limitations: only works
 * within a single process; serverless may spin multiple instances so limits are
 * per-instance. For production, use a shared store (Redis, Vercel KV, etc.).
 */
const RATE_LIMIT_MS = 15_000;
const lastRequestByIp = new Map<string, number>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = lastRequestByIp.get(ip);
  if (last != null && now - last < RATE_LIMIT_MS) return true;
  lastRequestByIp.set(ip, now);
  return false;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = validateBody(body);
  if (!parsed) {
    return NextResponse.json(
      { message: "Please provide a non-empty ingredients string (e.g. \"chicken, rice, onion\")." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again in a moment." },
      { status: 429 }
    );
  }

  try {
    const recipes = await generateRecipes(parsed.ingredients);
    return NextResponse.json({ recipes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Don't expose internal errors or API details; map to safe user-facing messages.
    // JSON parse / extraction failure: model returned invalid format -> 502.
    if (message.includes("Could not extract valid JSON") || message.includes("missing recipes")) {
      return NextResponse.json(
        { message: "Recipe generation failed. Please try again." },
        { status: 502 }
      );
    }
    // Missing key or OpenAI API errors: don't leak details.
    if (message.includes("OPENAI_API_KEY") || message.includes("Empty or invalid")) {
      return NextResponse.json(
        { message: "Recipe service is temporarily unavailable." },
        { status: 503 }
      );
    }
    // Rate limits, timeouts, network from OpenAI: treat as 503.
    return NextResponse.json(
      { message: "Recipe service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
