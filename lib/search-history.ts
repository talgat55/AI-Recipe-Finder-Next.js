import type { Recipe } from "@/types/recipe";

const LAST_SEARCH_KEY = "fridge-ai-last-search";
const HISTORY_KEY = "fridge-ai-history";
const MAX_HISTORY = 5;

export type LastSearch = {
  ingredients: string;
  recipes: Recipe[];
};

/**
 * We persist last successful search so the page can restore it on load without
 * a network call. Tradeoff: stale data if recipes change server-side; we
 * accept that for instant UX and let user re-run to refresh.
 */
export function readLastSearch(): LastSearch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_SEARCH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (
      !data ||
      typeof data !== "object" ||
      !("ingredients" in data) ||
      !("recipes" in data) ||
      typeof (data as LastSearch).ingredients !== "string" ||
      !Array.isArray((data as LastSearch).recipes)
    ) {
      return null;
    }
    return data as LastSearch;
  } catch {
    return null;
  }
}

export function saveLastSearch(ingredients: string, recipes: Recipe[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify({ ingredients, recipes }));
  } catch {
    // ignore quota or parse errors
  }
}

/**
 * History stores only ingredient strings (last 5) to keep storage small.
 * Re-run fetches fresh recipes from the API; we don't cache recipe payloads
 * in history to avoid duplication and size.
 */
export function readHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_HISTORY).filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Prepend new search, dedupe by normalized string, keep max size. */
export function appendToHistory(ingredients: string): void {
  if (typeof window === "undefined" || !ingredients.trim()) return;
  try {
    const normalized = ingredients.trim().toLowerCase();
    const prev = readHistory().filter((s) => s.trim().toLowerCase() !== normalized);
    const next = [ingredients.trim(), ...prev].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
