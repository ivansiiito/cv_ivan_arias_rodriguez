import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { DigitalTwin } from "@/components/digital-twin";
import textos from "@/i18n/textos.json";
import { isLocale, translate } from "@/i18n/locale";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import "./twin.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.iarias.es"),
  title: { default: "Iván Arias Rodríguez — Ingeniería, lenguaje e inteligencia artificial", template: "%s · Iván Arias Rodríguez" },
  description: "Ingeniero de telecomunicación y doctor en Lingüística Teórica y Aplicada. Conoce la trayectoria, formación y proyectos de Iván Arias Rodríguez.",
  applicationName: "Iván Arias Rodríguez · Portfolio",
  authors: [{ name: "Iván Arias Rodríguez" }],
  openGraph: {
    title: "Iván Arias Rodríguez — Ingeniería. Lenguaje. Inteligencia.",
    description: "Una trayectoria en el punto de encuentro entre la tecnología y el lenguaje.",
    locale: "es_ES",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f7f8f2" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const value = (await headers()).get("x-page-locale");
  const locale = isLocale(value) ? value : "es";
  return <html lang={locale} data-scroll-behavior="smooth"><body><a className="skip-link" href="#contenido">{translate(textos.navegacion.saltar, locale)}</a>{children}<DigitalTwin locale={locale}/></body></html>;
}
