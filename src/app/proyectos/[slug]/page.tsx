import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/data/profile";
import { languageAlternates } from "@/i18n/locale";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return { title: project?.title ?? "Proyecto no encontrado", description: project?.summary, alternates: { canonical: `/proyectos/${slug}`, languages: languageAlternates(`/proyectos/${slug}`) } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} locale="es"/>;
}
