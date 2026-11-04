import type { Project } from "@/data/profile";
import Image from "next/image";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

export function ProjectArt({ visual, locale = "es" }: { visual: Project["visual"]; locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const logo = (name: string) => t(textos.ilustraciones.logo).replace("{nombre}", name);
  if (visual === "textradar") return <div className="project-art textradar-art"><Image src="/logos/textradar-transparent.png" width={340} height={225} alt={logo("TextRadar")}/></div>;
  if (visual === "toucan") return <div className="project-art toucan-art"><Image src="/logos/toucan.jpg" width={1357} height={768} alt={logo("Toucan")}/></div>;
  if (visual === "commerce") return <div className="project-art commerce-art"><Image src="/logos/latostadora.png" width={206} height={31} alt={logo("latostadora")}/></div>;
  if (visual === "language") return <div className="project-art language-art" aria-hidden="true"><div className="language-orbit orbit-one"/><div className="language-orbit orbit-two"/><div className="language-orbit orbit-three"/><span className="language-word word-one">{t(textos.ilustraciones.lenguaje)}</span><span className="language-word word-two">{t(textos.ilustraciones.significado)}</span><span className="language-word word-three">{t(textos.ilustraciones.contexto)}</span><span className="language-symbol">a<span>↗</span></span><div className="language-note">{t(textos.ilustraciones.delLenguaje)}<br/>{t(textos.ilustraciones.alConocimiento)}</div></div>;
  return <div className="project-art network-art" aria-hidden="true"><svg viewBox="0 0 440 300"><defs><radialGradient id="network-glow"><stop stopColor="#b8df8a" stopOpacity=".2"/><stop offset="1" stopColor="#b8df8a" stopOpacity="0"/></radialGradient></defs><circle cx="220" cy="150" r="145" fill="url(#network-glow)"/><g stroke="#5c7156" strokeWidth=".8" fill="none"><path d="m55 65 135 20 118-34 73 93-90 99-117-13-119-65 135-80 101 158 17-192-134 179 16-145 191 59-207 86 46-80 88-99"/><circle cx="220" cy="150" r="93" fill="none" strokeDasharray="3 5"/><path d="m55 65 165 85 88-99M55 165l165-15 71 93M190 85l30 65 161-6"/></g>{[[55,65],[190,85],[308,51],[381,144],[291,243],[174,230],[55,165]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="9" fill="#2a3d2e" stroke="#6f8c60"/><circle cx={x} cy={y} r="3" fill="#c7eda0"/></g>)}<circle cx="220" cy="150" r="24" fill="#cbefa0"/><path d="M210 150h20m-10-10v20" stroke="#26372b" strokeWidth="1.5"/></svg><span className="network-label">{t(textos.ilustraciones.disenoConectado)}</span></div>;
}
