import type { Metadata, Viewport } from "next";
import { DigitalTwin } from "@/components/digital-twin";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import "./twin.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" data-scroll-behavior="smooth"><body><a className="skip-link" href="#contenido">Saltar al contenido</a>{children}<DigitalTwin/></body></html>;
}
