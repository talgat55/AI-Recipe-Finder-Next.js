import type { Locale } from "@/types/locale";

export type TranslationKey =
  | "tagline"
  | "emptyState"
  | "ingredientsLabel"
  | "ingredientsPlaceholder"
  | "ingredientsHint"
  | "generate"
  | "ingredients"
  | "steps"
  | "loading"
  | "recipeResults"
  | "error"
  | "history";

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    tagline: "Enter what you have — get recipe ideas",
    emptyState: "Enter ingredients to get recipe ideas",
    ingredientsLabel: "Ingredients (comma-separated)",
    ingredientsPlaceholder: "chicken, rice, onion",
    ingredientsHint: "Separate ingredients with commas",
    generate: "Generate",
    ingredients: "Ingredients",
    steps: "Steps",
    loading: "Loading",
    recipeResults: "Recipe results",
    error: "Error",
    history: "History",
  },
  ru: {
    tagline: "Введите, что есть — получите идеи рецептов",
    emptyState: "Введите продукты, чтобы получить идеи рецептов",
    ingredientsLabel: "Продукты (через запятую)",
    ingredientsPlaceholder: "курица, рис, лук",
    ingredientsHint: "Перечисляйте продукты через запятую",
    generate: "Подобрать",
    ingredients: "Ингредиенты",
    steps: "Шаги",
    loading: "Загрузка",
    recipeResults: "Результаты рецептов",
    error: "Ошибка",
    history: "История",
  },
  es: {
    tagline: "Escribe lo que tienes — obtén ideas de recetas",
    emptyState: "Introduce ingredientes para obtener ideas de recetas",
    ingredientsLabel: "Ingredientes (separados por comas)",
    ingredientsPlaceholder: "pollo, arroz, cebolla",
    ingredientsHint: "Separa los ingredientes con comas",
    generate: "Generar",
    ingredients: "Ingredientes",
    steps: "Pasos",
    loading: "Cargando",
    recipeResults: "Resultados de recetas",
    error: "Error",
    history: "Historial",
  },
  de: {
    tagline: "Gib ein, was du hast — erhalte Rezeptideen",
    emptyState: "Gib Zutaten ein, um Rezeptideen zu erhalten",
    ingredientsLabel: "Zutaten (kommagetrennt)",
    ingredientsPlaceholder: "Huhn, Reis, Zwiebel",
    ingredientsHint: "Zutaten mit Komma trennen",
    generate: "Generieren",
    ingredients: "Zutaten",
    steps: "Schritte",
    loading: "Laden",
    recipeResults: "Rezept Ergebnisse",
    error: "Fehler",
    history: "Verlauf",
  },
};
