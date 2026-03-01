import OpenAI from "openai";
import type { Recipe } from "@/types/recipe";

const RECIPE_SCHEMA = `
Each item must have: "name" (string), "description" (string), "ingredients" (array of strings), "steps" (array of strings).
Return a single JSON object with one key "recipes" whose value is an array of exactly 5 recipe objects. No markdown, no code fences.`;

/**
 * Pure service: no request/response objects. Uses OPENAI_API_KEY from env so
 * callers (e.g. API route) own env and error handling; keeps this testable.
 */
export async function generateRecipes(ingredients: string): Promise<Recipe[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a recipe assistant. Output only valid JSON. ${RECIPE_SCHEMA}`,
      },
      {
        role: "user",
        content: `Suggest exactly 5 recipes using these ingredients (and common pantry items): ${ingredients}. Return a JSON object with a "recipes" key containing an array of 5 recipes. Each recipe: name, description, ingredients (string array), steps (string array).`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = response.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty or invalid model response");
  }

  const parsed = parseRecipeJson(raw);
  return normalizeRecipes(parsed);
}

/**
 * Reliability: models sometimes wrap JSON in markdown or return malformed output.
 * Try direct parse first (best when response_format is respected), then regex
 * extraction so we don't fail on minor formatting before giving up with 502.
 */
function parseRecipeJson(raw: string): unknown {
  const trimmed = raw.trim();
  // Direct parse is most reliable when the model obeys response_format.
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fallback: extract JSON object containing "recipes" (handles ```json ... ``` or stray text).
    const objectMatch = trimmed.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // ignore
      }
    }
    const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return { recipes: JSON.parse(arrayMatch[0]) };
      } catch {
        // ignore
      }
    }
  }
  throw new Error("Could not extract valid JSON from model response");
}

/**
 * Coerce and validate to Recipe[]. Ensures we never pass invalid shapes to the
 * API response; skips malformed items instead of throwing so partial results
 * can still be returned when the model adds extra keys or wrong types.
 */
function normalizeRecipes(data: unknown): Recipe[] {
  if (!data || typeof data !== "object" || !("recipes" in data)) {
    throw new Error("Response missing recipes array");
  }
  const arr = (data as { recipes: unknown }).recipes;
  if (!Array.isArray(arr)) {
    throw new Error("recipes is not an array");
  }
  const out: Recipe[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : "";
    const description = typeof obj.description === "string" ? obj.description : "";
    const ingredients = Array.isArray(obj.ingredients)
      ? (obj.ingredients as unknown[]).map((x) => (typeof x === "string" ? x : String(x)))
      : [];
    const steps = Array.isArray(obj.steps)
      ? (obj.steps as unknown[]).map((x) => (typeof x === "string" ? x : String(x)))
      : [];
    if (name) {
      out.push({ name, description, ingredients, steps });
    }
  }
  return out;
}
