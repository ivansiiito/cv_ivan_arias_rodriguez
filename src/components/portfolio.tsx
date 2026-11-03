"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/profile";
import { ProjectArt } from "./project-art";

const filters = ["Todos", "Producto", "Lenguaje", "Ingeniería"] as const;

export function Portfolio() {
  const [filter, setFilter] = useState<typeof filters[number]>("Todos");
  const visible = projects.filter(project => filter === "Todos" || project.category === filter);
  return <>
    <div className="portfolio-toolbar"><div className="project-filters" role="group" aria-label="Filtrar proyectos por área">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === "Todos" && <span>{String(projects.length).padStart(2, "0")}</span>}</button>)}</div><span className="portfolio-note">UNA SELECCIÓN DE MI TRAYECTORIA</span></div>
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "proyecto" : "proyectos"} en {filter.toLowerCase()}.</p>
    <div className="projects-grid">
      {visible.map((project) => <article key={project.slug} className="project-card"><Link href={`/proyectos/${project.slug}`} aria-label={`Ver proyecto: ${project.title}`}><div className="project-cover"><ProjectArt visual={project.visual}/><span className="project-open"><ArrowUpRight size={16}/></span></div><div className="project-meta"><span>{project.category}</span><span>{project.period}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="project-read">Explorar proyecto <ArrowUpRight size={16} aria-hidden="true"/></span></Link></article>)}
    </div>
    <div className="next-project"><span className="next-project-symbol" aria-hidden="true">✳</span><div><h3>El próximo capítulo está por escribir.</h3><p>Este espacio seguirá creciendo con nuevos proyectos, ideas y aprendizajes.</p></div><a href="#contacto">¿Lo construimos juntos? <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  </>;
}
