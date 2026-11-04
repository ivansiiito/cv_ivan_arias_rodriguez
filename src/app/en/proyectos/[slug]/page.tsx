import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";
import { localizedProjects } from "@/i18n/profile";
import { languageAlternates } from "@/i18n/locale";

export const dynamicParams = false;
export function generateStaticParams() { return localizedProjects("en").map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = localizedProjects("en").find(item => item.slug === slug);
  return { title: project?.title ?? "Project not found", description: project?.summary, alternates: { canonical: `/en/proyectos/${slug}`, languages: languageAlternates(`/proyectos/${slug}`) } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} locale="en"/>;
}
