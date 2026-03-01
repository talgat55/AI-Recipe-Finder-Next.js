"use client";

import { useTranslations } from "@/lib/locale-context";

/**
 * Controlled input: value and onChange live in parent so we can restore last
 * search and sync with history clicks. Parent calls onGenerate with current
 * value when Generate is clicked.
 */
export function IngredientInput({
  value,
  onChange,
  onGenerate,
}: {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: (ingredients: string) => void;
}) {
  const t = useTranslations();

  const handleGenerate = () => {
    const trimmed = value.trim();
    if (trimmed) onGenerate?.(trimmed);
  };

  return (
    <div className="space-y-3">
      <label htmlFor="ingredients" className="sr-only">
        {t("ingredientsLabel")}
      </label>
      <textarea
        id="ingredients"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
