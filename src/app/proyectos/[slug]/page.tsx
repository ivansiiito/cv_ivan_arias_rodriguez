import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { ProjectArt } from "@/components/project-art";
import { projects } from "@/data/profile";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return { title: project?.title ?? "Proyecto no encontrado", description: project?.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  return <div id="inicio"><Header/><main id="contenido" className="project-detail container"><a href="/#proyectos" className="text-link project-back"><ArrowLeft size={17}/> Volver a proyectos</a><div className="section-kicker"><span className="kicker-dot"/>{project.category.toUpperCase()} · {project.period}</div><h1>{project.title}</h1><p className="project-detail-lead">{project.summary}</p><div className="project-detail-meta"><div><span>ORGANIZACIÓN</span><strong>{project.company}</strong></div><div><span>MI PAPEL</span><strong>{project.role}</strong></div><div><span>PERIODO</span><strong>{project.period}</strong></div></div><div className="project-detail-art"><ProjectArt visual={project.visual}/></div><div className="project-story"><div><div className="section-kicker">EL CONTEXTO</div><h2>Una mirada<br/>al trabajo.</h2></div><div><p className="large-copy">{project.intro}</p><h3>Mi contribución</h3><ul className="contributions">{project.contributions.map(item => <li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul><div className="tags project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.externalUrl && <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="button button-dark external-project">{project.externalLabel}<ArrowUpRight size={16}/></a>}<p className="project-source-note">Ficha basada en mi trayectoria profesional. La ilustración es una interpretación visual del área de trabajo.</p></div></div><Link className="next-project-link" href={`/proyectos/${nextProject.slug}`}><span>SIGUIENTE PROYECTO<strong>{nextProject.title}</strong></span><ArrowRight size={32} strokeWidth={1.3}/></Link></main><Contact/></div>;
}
