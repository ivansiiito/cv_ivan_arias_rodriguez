import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { localizedProjects } from "@/i18n/profile";
import { isLocale, locales } from "@/i18n/locale";

export const dynamicParams = false;
export function generateStaticParams() { return locales.filter(locale => locale !== "es" && locale !== "en").flatMap(lang => localizedProjects(lang).map(project => ({ lang, slug: project.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = localizedProjects(lang).find(item => item.slug === slug);
  return { title: project?.title, description: project?.summary, alternates: { canonical: `/${lang}/proyectos/${slug}`, languages: Object.fromEntries(locales.map(l => [l, `${l === "es" ? "" : "/" + l}/proyectos/${slug}`])) } };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return <ProjectDetail locale={lang} slug={slug}/>;
}
