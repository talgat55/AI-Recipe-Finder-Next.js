import { IngredientInput } from "@/components/IngredientInput";

/**
 * Homepage composes the main UI: title, ingredient input, and results area.
 * Kept thin so layout and state can grow in layout or dedicated sections later.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
      {/* Centered, max-width container for readability on large screens */}
      <div className="w-full max-w-2xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            FridgeAI
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Enter what you have — get recipe ideas
          </p>
        </header>

        <IngredientInput />

        {/* Results area: empty state until we add backend + list */}
        <section
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 min-h-[200px] flex items-center justify-center"
          aria-label="Recipe results"
        >
          <p className="text-slate-500 text-center text-sm sm:text-base">
            Enter ingredients to get recipe ideas
          </p>
        </section>
      </div>
    </main>
  );
}
