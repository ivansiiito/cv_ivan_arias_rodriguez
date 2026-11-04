import Home from "@/components/home-page";
import type { Metadata } from "next";
import { languageAlternates } from "@/i18n/locale";

export const metadata: Metadata = { alternates: { canonical: "/", languages: languageAlternates() } };

export default function Page() {
  return <Home locale="es"/>;
}
