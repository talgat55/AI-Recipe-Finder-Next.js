import { NextRequest, NextResponse } from "next/server";
import { readHistoryFromFile, appendHistoryToFile } from "@/services/history-file";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** GET: return history for this IP (from file). */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    const history = await readHistoryFromFile(ip);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ history: [] });
  }
}

/** POST: append ingredients to history for this IP, return updated list. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const ingredients = typeof body === "object" && body !== null && "ingredients" in body
    ? String((body as { ingredients: unknown }).ingredients ?? "").trim()
    : "";
  if (!ingredients) {
    const history = await readHistoryFromFile(ip);
    return NextResponse.json({ history });
  }
  try {
    const history = await appendHistoryToFile(ip, ingredients);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ history: [] });
  }
}
