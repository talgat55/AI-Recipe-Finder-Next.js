import type { Recipe } from "@/types/recipe";

const BASE = "https://www.themealdb.com/api/json/v1/1";
const NUMBER = 5;

type MealListItem = { idMeal: string; strMeal: string; strMealThumb: string | null };
type MealDetail = {
  strMeal: string;
  strMealThumb: string | null;
  strInstructions: string | null;
  strCategory?: string | null;
  strArea?: string | null;
  [key: string]: unknown;
};

/**
 * Fetches recipes from TheMealDB (free, no API key). Uses first ingredient from
 * the comma-separated list for the filter. Returns real recipes with real images.
 */
export async function fetchRecipesFromTheMealDB(ingredients: string): Promise<Recipe[]> {
  const firstIngredient = ingredients.split(",")[0]?.trim() || ingredients.trim();
  if (!firstIngredient) return [];

  const listRes = await fetch(
    `${BASE}/filter.php?i=${encodeURIComponent(firstIngredient)}`
  );
  if (!listRes.ok) return [];
  const listData = (await listRes.json()) as { meals: MealListItem[] | null };
  const list = listData?.meals;
  if (!Array.isArray(list) || list.length === 0) return [];

  const details = await Promise.all(
    list.slice(0, NUMBER).map((item) =>
      fetch(`${BASE}/lookup.php?i=${item.idMeal}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { meals: MealDetail[] | null } | null) => data?.meals?.[0] ?? null)
    )
  );

  const recipes: Recipe[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const info = details[i];
    const name = info?.strMeal ?? item?.strMeal ?? "Recipe";
    const imageUrl = info?.strMealThumb ?? item?.strMealThumb ?? undefined;

    const ingredientsList: string[] = [];
    if (info) {
      for (let k = 1; k <= 20; k++) {
        const ing = info[`strIngredient${k}`];
        const measure = info[`strMeasure${k}`];
        if (typeof ing === "string" && ing.trim()) {
          const part = typeof measure === "string" && measure.trim()
            ? `${measure.trim()} ${ing.trim()}`
            : ing.trim();
          ingredientsList.push(part);
        }
      }
    }

    const steps: string[] = [];
    if (info?.strInstructions) {
      const blocks = String(info.strInstructions)
        .split(/\r\n|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const block of blocks) {
        const sentences = block.split(/(?<=[.!?])\s+/).filter(Boolean);
        steps.push(...(sentences.length > 0 ? sentences : [block]));
      }
    }
    if (steps.length === 0 && info?.strInstructions) {
      steps.push(String(info.strInstructions).trim());
    }

    recipes.push({
      name,
      description: info?.strCategory ? `${info.strCategory}${info.strArea ? ` · ${info.strArea}` : ""}` : "Recipe from TheMealDB.",
      ingredients: ingredientsList.length > 0 ? ingredientsList : [firstIngredient],
      steps: steps.length > 0 ? steps : ["See source for instructions."],
      imageUrl: imageUrl || undefined,
    });
  }
  return recipes;
}
