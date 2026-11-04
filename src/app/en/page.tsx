import type { Metadata } from "next";
import Home from "@/components/home-page";
import { languageAlternates } from "@/i18n/locale";

export const metadata: Metadata = {
  title: { absolute: "Iván Arias Rodríguez — Engineering, language and artificial intelligence" },
  description: "Telecommunications engineer and linguist. Explore Iván Arias Rodríguez’s experience, education and projects.",
  alternates: { canonical: "/en", languages: languageAlternates() },
  openGraph: { title: "Iván Arias Rodríguez — Engineering. Language. Intelligence.", description: "A career at the intersection of technology and language.", locale: "en_GB", type: "website" },
};

export default function Page() {
  return <Home locale="en"/>;
}
