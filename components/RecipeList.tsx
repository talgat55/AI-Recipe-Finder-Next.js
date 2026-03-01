import type { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";

/**
 * RecipeList exists to own the "list of recipes" layout and mapping. Keeps the page
 * from mixing iteration logic with section structure and makes it easy to add
 * empty state, filters, or grid vs list layout in one place.
 */
export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return null;
  return (
    <ul className="space-y-6 list-none p-0 m-0" aria-label="Recipe results">
      {recipes.map((recipe, index) => (
        <li key={`${recipe.name}-${index}`}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
