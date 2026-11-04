export const locales = ["es", "ca", "en", "fr", "it", "pt", "fi", "ru"] as const;
export type Locale = typeof locales[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some(locale => locale === value);
}

export function localePrefix(locale: Locale): string {
  return locale === "es" ? "" : `/${locale}`;
}

export function languageAlternates(path = ""): Record<Locale, string> {
  return Object.fromEntries(locales.map(locale => [locale, `${localePrefix(locale)}${path || "/"}`])) as Record<Locale, string>;
}

export function translate(text: { es: string; en?: string }, locale: Locale): string {
  return (text as Record<string, unknown>)[locale] as string || text.es;
}
