"use client";

import { useState } from "react";

/**
 * IngredientInput is a client component so we can hold local state for the
 * text value and handle submit. Parent passes onGenerate to receive the action;
 * we don't parse ingredients here so the page/API can own that contract.
 */
export function IngredientInput({ onGenerate }: { onGenerate?: () => void }) {
  const [value, setValue] = useState("");

  const handleGenerate = () => {
    onGenerate?.();
  };

  return (
    <div className="space-y-3">
      <label htmlFor="ingredients" className="sr-only">
        Ingredients (comma-separated)
      </label>
      <textarea
        id="ingredients"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="chicken, rice, onion"
        className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-y"
        aria-describedby="ingredients-hint"
      />
      <p id="ingredients-hint" className="text-slate-500 text-xs">
        Separate ingredients with commas
      </p>
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
      >
        Generate
      </button>
    </div>
  );
}
