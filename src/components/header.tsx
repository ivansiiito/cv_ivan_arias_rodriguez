"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import textos from "@/i18n/textos.json";
import { localePrefix, translate, type Locale } from "@/i18n/locale";
import { LanguageSelector } from "./language-selector";

const links = [["sobre-mi", textos.navegacion.sobreMi], ["trayectoria", textos.navegacion.trayectoria], ["formacion", textos.navegacion.formacion], ["proyectos", textos.navegacion.proyectos]] as const;

export function Header({ home = false, locale = "es" }: { home?: boolean; locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const homePath = `${localePrefix(locale)}/`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [home]);

  function goTo(id: string) {
    setOpen(false);
    if (home) {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "auto" }); history.pushState(null, "", `#${id}`); }
    } else {
      window.location.href = `${homePath}#${id}`;
    }
  }

  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href={homePath} aria-label={t(textos.navegacion.inicio)}><BrandMark/><span className="brand-name">Iván Arias Rodríguez<span className="brand-period">.</span></span></Link>
    <nav id="main-navigation" className={`main-navigation ${open ? "is-open" : ""}`} aria-label={t(textos.navegacion.principal)}>
      {links.map(([id, label]) => <button key={id} type="button" className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined} onClick={() => goTo(id)}>{t(label)}</button>)}
      <button type="button" className="button button-dark nav-contact" onClick={() => goTo("contacto")}>{t(textos.navegacion.contacto)} <ArrowUpRight size={16} aria-hidden="true"/></button>
    </nav>
    <LanguageSelector locale={locale} />
    <button ref={menuButton} className="menu-toggle" aria-label={t(open ? textos.navegacion.cerrarMenu : textos.navegacion.abrirMenu)} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div></header>;
}
