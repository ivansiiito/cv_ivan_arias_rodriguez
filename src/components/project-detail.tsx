import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { ProjectArt } from "@/components/project-art";
import { localizedProjects } from "@/i18n/profile";
import textos from "@/i18n/textos.json";
import { localePrefix, translate, type Locale } from "@/i18n/locale";

export function ProjectDetail({ slug, locale = "es" }: { slug: string; locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const prefix = localePrefix(locale);
  const projects = localizedProjects(locale);
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  const category = { Producto: textos.cartera.producto, Lenguaje: textos.cartera.lenguaje, Ingeniería: textos.cartera.ingenieria };
  return <div id="inicio"><Header locale={locale}/><main id="contenido" className="project-detail container"><a href={`${prefix}/#proyectos`} className="text-link project-back"><ArrowLeft size={17}/> {t(textos.ficha.volver)}</a><div className="section-kicker"><span className="kicker-dot"/>{t(category[project.category]).toUpperCase()} · {project.period}</div><h1>{project.title}</h1><p className="project-detail-lead">{project.summary}</p><div className="project-detail-meta"><div><span>{t(textos.ficha.organizacion)}</span><strong>{project.company}</strong></div><div><span>{t(textos.ficha.papel)}</span><strong>{project.role}</strong></div><div><span>{t(textos.ficha.periodo)}</span><strong>{project.period}</strong></div></div><div className="project-detail-art"><ProjectArt visual={project.visual} locale={locale}/></div><div className="project-story"><div><div className="section-kicker">{t(textos.ficha.contexto)}</div><h2>{t(textos.ficha.mirada)}<br/>{t(textos.ficha.trabajo)}</h2></div><div><p className="large-copy">{project.intro}</p><h3>{t(textos.ficha.contribucion)}</h3><ul className="contributions">{project.contributions.map(item => <li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul><div className="tags project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.externalUrl && <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="button button-dark external-project">{project.externalLabel}<ArrowUpRight size={16}/></a>}<p className="project-source-note">{t(textos.ficha.nota)}</p></div></div><Link className="next-project-link" href={`${prefix}/proyectos/${nextProject.slug}`}><span>{t(textos.ficha.siguiente)}<strong>{nextProject.title}</strong></span><ArrowRight size={32} strokeWidth={1.3}/></Link></main><Contact locale={locale}/></div>;
}
