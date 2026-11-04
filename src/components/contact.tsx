"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { profile } from "@/data/profile";
import textos from "@/i18n/textos.json";
import { localePrefix, translate, type Locale } from "@/i18n/locale";

export function Contact({ locale = "es" }: { locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const copy = textos.contacto;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
    } catch { setCopyState("error"); }
  }
  return <>
    <section id="contacto" className="contact-section"><div className="container">
      <div className="section-kicker"><span className="kicker-dot"/>{t(copy.seccion)}</div>
      <div className="contact-heading"><h2>{t(copy.titulo1)}<br/>{t(copy.titulo2)}<span>{t(copy.titulo3)}</span></h2><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label={t(copy.correoAccesible)}><ArrowUpRight size={54} strokeWidth={1.25}/></a></div>
      <div className="contact-bottom"><div><p className="contact-intro">{t(copy.intro)}</p><div className="email-row"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-button" onClick={copyEmail} aria-label={t(copyState === "copied" ? copy.copiado : copy.copiar)} title={t(copy.copiarCorto)}>{copyState === "copied" ? <Check size={18}/> : <Copy size={18}/>}</button></div><span className="copy-feedback" role="status">{copyState === "copied" ? t(copy.copiadoMensaje) : copyState === "error" ? t(copy.error) : ""}</span></div><div className="contact-links"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span className="linkedin-icon" aria-hidden="true">in</span> LinkedIn <ArrowUpRight size={16} aria-hidden="true"/></a><a href={profile.cv} download="Ivan-Arias-Rodriguez-CV.docx"><Download size={17} aria-hidden="true"/> {t(copy.descargar)} <span className="file-type">DOCX</span></a></div></div>
    </div></section>
    <footer className="site-footer"><div className="container footer-inner"><a href={`${localePrefix(locale)}/`} className="footer-name">Iván Arias Rodríguez.</a><p>© {new Date().getFullYear()} Iván Arias Rodríguez</p><span>{t(copy.firma)}</span><a href="#inicio" className="back-top" aria-label={t(copy.volver)}><ArrowUp size={17}/></a></div></footer>
  </>;
}
