"use client";

import { useTranslations } from "@/lib/locale-context";

/**
 * Renders last 5 ingredient searches as clickable chips. Click re-runs search
 * via parent callback so we keep a single source of truth for "current search".
 */
export function SearchHistory({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (ingredients: string) => void;
}) {
  const t = useTranslations();
  if (items.length === 0) return null;

  return (
    <section className="space-y-2" aria-label={t("history")}>
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {t("history")}
      </h2>
      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
        {items.map((ingredients, i) => (
          <li key={`${ingredients}-${i}`}>
            <button
              type="button"
              onClick={() => onSelect(ingredients)}
              className="px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 transition-colors truncate max-w-[200px] sm:max-w-[280px]"
              title={ingredients}
            >
              {ingredients.length > 40 ? `${ingredients.slice(0, 37)}…` : ingredients}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
