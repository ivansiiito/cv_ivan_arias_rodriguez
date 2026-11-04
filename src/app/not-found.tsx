import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import textos from "@/i18n/textos.json";
import { isLocale, localePrefix, translate } from "@/i18n/locale";

export default async function NotFound() {
  const value = (await headers()).get("x-page-locale");
  const locale = isLocale(value) ? value : "es";
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  return <main id="contenido" className="not-found"><span className="section-kicker">{t(textos.paginaNoEncontrada.etiqueta)}</span><h1>{t(textos.paginaNoEncontrada.titulo1)}<br/>{t(textos.paginaNoEncontrada.titulo2)}</h1><p>{t(textos.paginaNoEncontrada.texto)}</p><Link className="button button-dark" href={localePrefix(locale) || "/"}><ArrowLeft size={18}/> {t(textos.paginaNoEncontrada.volver)}</Link></main>;
}
