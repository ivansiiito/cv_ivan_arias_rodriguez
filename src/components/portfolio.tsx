"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localizedProjects } from "@/i18n/profile";
import textos from "@/i18n/textos.json";
import { localePrefix, translate, type Locale } from "@/i18n/locale";
import { ProjectArt } from "./project-art";

const filters = ["Todos", "Producto", "Lenguaje", "Ingeniería"] as const;

export function Portfolio({ locale = "es" }: { locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const labels = { Todos: textos.cartera.todos, Producto: textos.cartera.producto, Lenguaje: textos.cartera.lenguaje, Ingeniería: textos.cartera.ingenieria };
  const projects = localizedProjects(locale);
  const [filter, setFilter] = useState<typeof filters[number]>("Todos");
  const visible = projects.filter(project => filter === "Todos" || project.category === filter);
  return <>
    <div className="portfolio-toolbar"><div className="project-filters" role="group" aria-label={t(textos.cartera.filtrar)}>{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{t(labels[item])}{item === "Todos" && <span>{String(projects.length).padStart(2, "0")}</span>}</button>)}</div><span className="portfolio-note">{t(textos.cartera.nota)}</span></div>
    <p className="sr-only" role="status">{t(visible.length === 1 ? textos.cartera.resultadosUno : textos.cartera.resultadosMuchos).replace("{n}", String(visible.length)).replace("{categoria}", t(labels[filter]).toLowerCase())}</p>
    <div className="projects-grid">
      {visible.map((project) => <article key={project.slug} className="project-card"><Link className="project-cover" href={`${localePrefix(locale)}/proyectos/${project.slug}`} aria-label={t(textos.cartera.verProyecto).replace("{titulo}", project.title)}><ProjectArt visual={project.visual} locale={locale}/><span className="project-open" aria-hidden="true"><ArrowUpRight size={16}/></span></Link><div className="project-meta"><span>{t(labels[project.category])}</span><span>{project.period}</span></div><h3>{project.title}</h3><p>{project.summary}</p><Link className="project-read" href={`${localePrefix(locale)}/proyectos/${project.slug}`} aria-label={t(textos.cartera.explorarProyecto).replace("{titulo}", project.title)}>{t(textos.cartera.explorar)} <ArrowUpRight size={16} aria-hidden="true"/></Link></article>)}
    </div>
    <div className="next-project"><span className="next-project-symbol" aria-hidden="true">✳</span><div><h3>{t(textos.cartera.siguienteTitulo)}</h3><p>{t(textos.cartera.siguienteTexto)}</p></div><a href="#contacto">{t(textos.cartera.construir)} <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  </>;
}
