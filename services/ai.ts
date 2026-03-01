import { Mistral } from "@mistralai/mistralai";
import type { Recipe } from "@/types/recipe";
import type { Locale } from "@/types/locale";

const RECIPE_SCHEMA = `
Each item must have: "name" (string), "description" (string), "ingredients" (array of strings), "steps" (array of strings).
Return a single JSON object with one key "recipes" whose value is an array of exactly 5 recipe objects. No markdown, no code fences.`;

/** Language instruction so the model outputs recipe text in the user's UI language. */
const LOCALE_LANGUAGE: Record<Locale, string> = {
  en: "Write all recipe names, descriptions, ingredients, and steps in English.",
  ru: "Пиши все названия рецептов, описания, ингредиенты и шаги только на русском языке.",
  es: "Escribe todos los nombres de recetas, descripciones, ingredientes y pasos en español.",
  de: "Schreibe alle Rezeptnamen, Beschreibungen, Zutaten und Schritte auf Deutsch.",
};

/**
 * Pure service: no request/response objects. Uses MISTRAL_API_KEY from env so
 * callers (e.g. API route) own env and error handling; keeps this testable.
 * locale: user's UI language; model is instructed to output recipes in that language.
 */
export async function generateRecipes(ingredients: string, locale: Locale = "en"): Promise<Recipe[]> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not set");
  }

  const languageRule = LOCALE_LANGUAGE[locale] ?? LOCALE_LANGUAGE.en;
  const mistral = new Mistral({ apiKey });
  const result = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "system",
        content: `You are a recipe assistant. ${languageRule} Output only valid JSON. ${RECIPE_SCHEMA}`,
      },
      {
        role: "user",
        content: `Suggest exactly 5 recipes using these ingredients (and common pantry items): ${ingredients}. Return a JSON object with a "recipes" key containing an array of 5 recipes. Each recipe: name, description, ingredients (string array), steps (string array). All text must be in the language specified in the system message.`,
      },
    ],
    responseFormat: { type: "json_object" as const },
    temperature: 0.7,
  });

  const message = result.choices?.[0]?.message;
  const raw = message?.content;
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
  try {
    return JSON.parse(trimmed);
  } catch {
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
