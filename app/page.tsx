"use client";

import { useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { Loader } from "@/components/Loader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "@/lib/locale-context";
import type { Recipe } from "@/types/recipe";

/**
 * Homepage composes the main UI: title, ingredient input, and results area.
 * On Generate we call the API and show loading or inline error.
 */
export default function HomePage() {
  const t = useTranslations();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (ingredients: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRecipes([]);
        setError(typeof data.message === "string" ? data.message : "Something went wrong.");
        return;
      }
      setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
    } catch {
      setRecipes([]);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-10">
        <header className="text-center relative">
          <div className="absolute top-0 right-0 sm:right-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            FridgeAI
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            {t("tagline")}
          </p>
        </header>

        <IngredientInput onGenerate={handleGenerate} />

        {error && (
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm"
            role="alert"
          >
            <span className="font-medium">{t("error")}: </span>
            {error}
          </div>
        )}

        <section
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 min-h-[200px]"
          aria-label={t("recipeResults")}
        >
          {loading && <Loader />}
          {!loading && recipes.length > 0 && <RecipeList recipes={recipes} />}
          {!loading && recipes.length === 0 && !error && (
            <p className="text-slate-500 text-center text-sm sm:text-base py-8">
              {t("emptyState")}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
