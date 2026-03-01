"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/locale-context";

/**
 * IngredientInput is a client component so we can hold local state for the
 * text value and handle submit. Parent receives current ingredients string
 * so it can call the API with the same value.
 */
export function IngredientInput({ onGenerate }: { onGenerate?: (ingredients: string) => void }) {
  const t = useTranslations();
  const [value, setValue] = useState("");

  const handleGenerate = () => {
    onGenerate?.(value.trim());
  };

  return (
    <div className="space-y-3">
      <label htmlFor="ingredients" className="sr-only">
        {t("ingredientsLabel")}
      </label>
      <textarea
        id="ingredients"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("ingredientsPlaceholder")}
        className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-y"
        aria-describedby="ingredients-hint"
      />
      <p id="ingredients-hint" className="text-slate-500 text-xs">
        {t("ingredientsHint")}
      </p>
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
      >
        {t("generate")}
      </button>
    </div>
  );
}
