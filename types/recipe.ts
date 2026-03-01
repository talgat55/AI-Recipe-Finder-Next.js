/**
 * Types live in /types so they can be imported by both UI and API code
 * without circular deps, and stay a single source of truth for the domain model.
 */
export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  /** Optional image URL; if missing, UI can assign one from a preset. */
  imageUrl?: string;
}
