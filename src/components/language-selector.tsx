"use client";

import { usePathname } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import { ChevronDown } from "lucide-react";
import textos from "@/i18n/textos.json";
import { locales, localePrefix, translate, type Locale } from "@/i18n/locale";

const names: Record<Locale, string> = { es: "Español", ca: "Català", en: "English", fr: "Français", it: "Italiano", pt: "Português", fi: "Suomi", ru: "Русский" };

function Flag({ locale }: { locale: Locale }) {
  if (locale === "es") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>;
  if (locale === "ca") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#ffda00"/>{[2,6,10,14].map(y => <rect key={y} y={y} width="30" height="2" fill="#da121a"/>)}</svg>;
  if (locale === "en") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0 30 20 M30 0 0 20" stroke="#fff" strokeWidth="4"/><path d="M0 0 30 20 M30 0 0 20" stroke="#c8102e" strokeWidth="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3"/></svg>;
  if (locale === "fr" || locale === "it") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill={locale === "fr" ? "#002395" : "#009246"}/><rect x="20" width="10" height="20" fill={locale === "fr" ? "#ed2939" : "#ce2b37"}/></svg>;
  if (locale === "pt") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#da291c"/><rect width="12" height="20" fill="#006600"/><circle cx="12" cy="10" r="4" fill="#ffda44"/><path d="M10 7h4v4c0 2-2 3-2 3s-2-1-2-3z" fill="#fff" stroke="#da291c" strokeWidth=".7"/></svg>;
  if (locale === "fi") return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><path d="M9 0v20M0 10h30" stroke="#003580" strokeWidth="3.5"/></svg>;
  return <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect y="6.66" width="30" height="6.67" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/></svg>;
}

export function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dropdown = useRef<HTMLDetailsElement>(null);
  const root = pathname.replace(/^\/(?:ca|en|fr|it|pt|fi|ru)(?=\/|$)/, "") || "/";
  const destination = (lang: Locale) => localePrefix(lang) + (root === "/" ? (lang === "es" ? "/" : "") : root);
  function change(event: MouseEvent<HTMLAnchorElement>, lang: Locale) {
    event.preventDefault();
    if (lang === locale) { if (dropdown.current) dropdown.current.open = false; return; }
    window.location.assign(`${destination(lang)}${window.location.search}${window.location.hash}`);
  }
  return <details className="language-selector" ref={dropdown} onKeyDown={event => { if (event.key === "Escape" && dropdown.current?.open) { dropdown.current.open = false; dropdown.current.querySelector("summary")?.focus(); } }}>
    <summary aria-label={`${translate(textos.navegacion.elegirIdioma, locale)}: ${names[locale]}`}><Flag locale={locale}/><span>{names[locale]}</span><ChevronDown size={14} aria-hidden="true"/></summary>
    <div className="language-options">{locales.map(lang => <a key={lang} href={destination(lang)} lang={lang} hrefLang={lang} aria-current={locale === lang ? "true" : undefined} onClick={event => change(event, lang)}><Flag locale={lang}/>{names[lang]}</a>)}</div>
  </details>;
}
