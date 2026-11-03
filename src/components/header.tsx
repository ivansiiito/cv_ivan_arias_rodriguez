"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";

const links = [["sobre-mi", "Sobre mí"], ["trayectoria", "Trayectoria"], ["formacion", "Formación"], ["proyectos", "Proyectos"]];

export function Header({ home = false }: { home?: boolean }) {
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
      window.location.href = `/#${id}`;
    }
  }

  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="Iván Arias Rodríguez, inicio"><BrandMark/><span className="brand-name">Iván Arias Rodríguez<span className="brand-period">.</span></span></Link>
    <nav id="main-navigation" className={`main-navigation ${open ? "is-open" : ""}`} aria-label="Navegación principal">
      {links.map(([id, label]) => <button key={id} type="button" className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined} onClick={() => goTo(id)}>{label}</button>)}
      <button type="button" className="button button-dark nav-contact" onClick={() => goTo("contacto")}>Hablemos <ArrowUpRight size={16} aria-hidden="true"/></button>
    </nav>
    <button ref={menuButton} className="menu-toggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div></header>;
}
