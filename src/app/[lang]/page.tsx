import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/components/home-page";
import textos from "@/i18n/textos.json";
import { isLocale, locales, translate } from "@/i18n/locale";

export const dynamicParams = false;
export function generateStaticParams() { return locales.filter(locale => locale !== "es" && locale !== "en").map(lang => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = ["ingenieria", "lenguaje", "ia"] as const;
  return { title: { absolute: `Iván Arias Rodríguez — ${title.map(key => translate(textos.mapa[key], lang)).join(" · ")}` }, description: translate(textos.inicio.heroDescripcion, lang), alternates: { canonical: `/${lang}`, languages: Object.fromEntries(locales.map(l => [l, l === "es" ? "/" : `/${l}`])) } };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return <Home locale={lang}/>;
}
