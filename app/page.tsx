"use client";

import { useState, useEffect } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { Loader } from "@/components/Loader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchHistory } from "@/components/SearchHistory";
import { useTranslations, useLocale } from "@/lib/locale-context";
import {
  readLastSearch,
  saveLastSearch,
  readHistory,
  appendToHistory,
} from "@/lib/search-history";
import type { Recipe } from "@/types/recipe";

/**
 * State lives in the page so we can restore from localStorage, drive history,
 * and keep a single place for UI state. Tradeoff: page holds more; we avoid
 * context or separate store for this feature set.
 *
 * UI states (mutually exclusive in the results section):
 * - empty: no search yet, no error
 * - loading: request in flight
 * - error: request failed or validation
 * - success: we have recipes to show
 */
export default function HomePage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [recipeSource, setRecipeSource] = useState<"ai" | "sites">("sites");
  const [hydrated, setHydrated] = useState(false);

  // Restore last search from localStorage; history from file (API) or fallback to localStorage.
  useEffect(() => {
    const last = readLastSearch();
    if (last?.ingredients && Array.isArray(last.recipes) && last.recipes.length > 0) {
      setIngredients(last.ingredients);
      setRecipes(last.recipes);
    }
    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.history)) setHistory(data.history);
        else setHistory(readHistory());
      })
      .catch(() => setHistory(readHistory()));
    setHydrated(true);
  }, []);

  const handleGenerate = async (ingredientsInput: string) => {
    if (!ingredientsInput.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsInput, locale, source: recipeSource }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRecipes([]);
        setError(typeof data.message === "string" ? data.message : "Something went wrong.");
        return;
      }
      const nextRecipes = Array.isArray(data.recipes) ? data.recipes : [];
      setRecipes(nextRecipes);
      setIngredients(ingredientsInput);
      saveLastSearch(ingredientsInput, nextRecipes);
      const historyRes = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsInput }),
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json().catch(() => ({}));
        if (Array.isArray(historyData.history)) setHistory(historyData.history);
        else { appendToHistory(ingredientsInput); setHistory(readHistory()); }
      } else {
        appendToHistory(ingredientsInput);
        setHistory(readHistory());
      }
    } catch {
      setRecipes([]);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (ing: string) => {
    setIngredients(ing);
    handleGenerate(ing);
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

        {hydrated && (
          <>
            <IngredientInput
              value={ingredients}
              onChange={setIngredients}
              onGenerate={handleGenerate}
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-600 text-sm">{t("sourceLabel")}:</span>
              <select
                value={recipeSource}
                onChange={(e) => setRecipeSource(e.target.value as "ai" | "sites")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label={t("sourceLabel")}
              >
                <option value="sites">{t("sourceSites")}</option>
                <option value="ai">{t("sourceAi")}</option>
              </select>
            </div>

            {history.length > 0 && (
              <SearchHistory items={history} onSelect={handleHistorySelect} />
            )}

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
          </>
        )}
      </div>
    </main>
  );
}
