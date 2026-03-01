/**
 * Simple loading indicator. Reusable so we can swap in skeleton or brand spinner later.
 */
export function Loader() {
  return (
    <div className="flex items-center justify-center py-12" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
    </div>
  );
}
