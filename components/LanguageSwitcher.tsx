"use client";

import { useLocale } from "@/lib/locale-context";
import { LOCALES } from "@/types/locale";

/**
 * Dropdown to switch UI language. Persists choice in localStorage via LocaleProvider.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="relative inline-block">
      <label htmlFor="lang-select" className="sr-only">
        Language
      </label>
      <select
        id="lang-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as "en" | "ru" | "es" | "de")}
        className="appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent cursor-pointer hover:border-slate-400 transition-colors"
        aria-label="Select language"
      >
        {LOCALES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
        ▼
      </span>
    </div>
  );
}
