"use client";

import { useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { Loader } from "@/components/Loader";
import type { Recipe } from "@/types/recipe";

/** Mock recipes for "Generate" until we have a backend. */
function getMockRecipes(): Recipe[] {
  return [
    {
      name: "Simple Chicken Rice Bowl",
      description: "One-pan chicken and rice with onion. Quick and filling.",
      ingredients: ["chicken", "rice", "onion", "oil", "salt", "pepper"],
      steps: [
        "Dice onion and chicken.",
        "Sauté onion in oil until soft, then add chicken and cook through.",
        "Add rice and water, bring to a boil, then simmer until rice is tender.",
        "Season with salt and pepper and serve.",
      ],
    },
    {
      name: "Onion Rice Pilaf",
      description: "Fragrant rice with caramelized onion.",
      ingredients: ["rice", "onion", "butter", "stock", "salt"],
      steps: [
        "Slice onion and cook in butter until golden.",
        "Add rice and stir to coat.",
        "Pour in stock, bring to a boil, cover and simmer until rice is done.",
        "Fluff and season with salt.",
      ],
    },
  ];
}

/**
 * Homepage composes the main UI: title, ingredient input, and results area.
 * State lives here so we can show loading + recipes when Generate is clicked.
 */
export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate a short delay so Loader is visible; replace with API call later.
    setTimeout(() => {
      setRecipes(getMockRecipes());
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            FridgeAI
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Enter what you have — get recipe ideas
          </p>
        </header>

        <IngredientInput onGenerate={handleGenerate} />

        <section
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 min-h-[200px]"
          aria-label="Recipe results"
        >
          {loading && <Loader />}
          {!loading && recipes.length > 0 && <RecipeList recipes={recipes} />}
          {!loading && recipes.length === 0 && (
            <p className="text-slate-500 text-center text-sm sm:text-base py-8">
              Enter ingredients to get recipe ideas
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
