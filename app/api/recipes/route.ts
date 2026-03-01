import { NextRequest, NextResponse } from "next/server";
import type { Recipe } from "@/types/recipe";

/**
 * Validate POST body: we expect { ingredients: string }.
 * Reject empty or too-short input so we don't call AI or return meaningless stubs.
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
 * Stub: deterministic recipes from ingredient keywords. Exists so the frontend
 * can integrate against a real API contract before we add OpenAI; swap this
 * for an AI call later without changing the route signature.
 */
function getStubRecipes(ingredientsRaw: string): Recipe[] {
  const lower = ingredientsRaw.toLowerCase();
  const recipes: Recipe[] = [];

  if (lower.includes("egg") || lower.includes("eggs")) {
    recipes.push({
      name: "Omelette",
      description: "Classic folded omelette. Fast and versatile.",
      ingredients: ["eggs", "butter", "salt", "pepper"],
      steps: [
        "Beat eggs with a pinch of salt and pepper.",
        "Melt butter in a non-stick pan over medium heat.",
        "Pour in eggs, let set slightly, then fold and serve.",
      ],
    });
  }

  if (lower.includes("chicken") && (lower.includes("rice") || lower.includes("onion"))) {
    recipes.push({
      name: "Simple Chicken Rice Bowl",
      description: "One-pan chicken and rice with onion. Quick and filling.",
      ingredients: ["chicken", "rice", "onion", "oil", "salt", "pepper"],
      steps: [
        "Dice onion and chicken.",
        "Sauté onion in oil until soft, then add chicken and cook through.",
        "Add rice and water, bring to a boil, then simmer until rice is tender.",
        "Season with salt and pepper and serve.",
      ],
    });
  }

  if (lower.includes("rice") && lower.includes("onion") && !recipes.some((r) => r.name.includes("Chicken"))) {
    recipes.push({
      name: "Onion Rice Pilaf",
      description: "Fragrant rice with caramelized onion.",
      ingredients: ["rice", "onion", "butter", "stock", "salt"],
      steps: [
        "Slice onion and cook in butter until golden.",
        "Add rice and stir to coat.",
        "Pour in stock, bring to a boil, cover and simmer until rice is done.",
        "Fluff and season with salt.",
      ],
    });
  }

  if (recipes.length === 0) {
    recipes.push({
      name: "Use What You Have",
      description: "Combine your ingredients in a pan with oil, season, and cook until done.",
      ingredients: ["your ingredients", "oil", "salt", "pepper"],
      steps: [
        "Chop ingredients evenly.",
        "Heat oil in a pan, add ingredients and season.",
        "Cook until tender and serve.",
      ],
    });
  }

  return recipes;
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

  const recipes = getStubRecipes(parsed.ingredients);
  return NextResponse.json({ recipes });
}
