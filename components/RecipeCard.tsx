"use client";

import type { Recipe } from "@/types/recipe";
import { useTranslations } from "@/lib/locale-context";

/**
 * Single recipe display. Encapsulates layout for name, description, ingredients, steps
 * so RecipeList stays a thin mapper and we can change card design in one place.
 */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const t = useTranslations();
  const { name, description, ingredients, steps } = recipe;
  return (
    <article
      className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow transition-colors"
      aria-label={`Recipe: ${name}`}
    >
      <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
      {description ? (
        <p className="mt-2 text-slate-600 text-sm">{description}</p>
      ) : null}
      <div className="mt-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("ingredients")}</h4>
        <ul className="mt-1.5 list-disc list-inside text-slate-700 text-sm space-y-0.5">
          {ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("steps")}</h4>
        <ol className="mt-1.5 list-decimal list-inside text-slate-700 text-sm space-y-1">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </article>
  );
}
