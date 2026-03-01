/** Supported UI locales. Default is "en". */
export type Locale = "en" | "ru" | "es" | "de";

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
];
