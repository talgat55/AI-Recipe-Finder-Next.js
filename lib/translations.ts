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
  | "history"
  | "sourceAi"
  | "sourceSites"
  | "sourceLabel";

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
    sourceAi: "AI",
    sourceSites: "Recipe sites",
    sourceLabel: "Source",
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
    sourceAi: "ИИ",
    sourceSites: "Сайты рецептов",
    sourceLabel: "Источник",
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
    sourceAi: "IA",
    sourceSites: "Sitios de recetas",
    sourceLabel: "Fuente",
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
    sourceAi: "KI",
    sourceSites: "Rezeptseiten",
    sourceLabel: "Quelle",
  },
};
