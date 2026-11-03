"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { profile } from "@/data/profile";

export function Contact() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
    } catch { setCopyState("error"); }
  }
  return <>
    <section id="contacto" className="contact-section"><div className="container">
      <div className="section-kicker"><span className="kicker-dot"/>05 — CONECTEMOS</div>
      <div className="contact-heading"><h2>Las buenas ideas empiezan<br/>con una <span>conversación.</span></h2><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Escribir un correo a Iván"><ArrowUpRight size={54} strokeWidth={1.25}/></a></div>
      <div className="contact-bottom"><div><p className="contact-intro">¿Un proyecto, una colaboración o una buena pregunta?</p><div className="email-row"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-button" onClick={copyEmail} aria-label={copyState === "copied" ? "Correo copiado" : "Copiar correo electrónico"} title="Copiar correo">{copyState === "copied" ? <Check size={18}/> : <Copy size={18}/>}</button></div><span className="copy-feedback" role="status">{copyState === "copied" ? "Correo copiado al portapapeles." : copyState === "error" ? "No se pudo copiar. Puedes seleccionar el correo o abrir el enlace." : ""}</span></div><div className="contact-links"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span className="linkedin-icon" aria-hidden="true">in</span> LinkedIn <ArrowUpRight size={16} aria-hidden="true"/></a><a href={profile.cv} download="Ivan-Arias-Rodriguez-CV.docx"><Download size={17} aria-hidden="true"/> Descargar CV <span className="file-type">DOCX</span></a></div></div>
    </div></section>
    <footer className="site-footer"><div className="container footer-inner"><a href="/" className="footer-name">Iván Arias Rodríguez.</a><p>© {new Date().getFullYear()} Iván Arias Rodríguez</p><span>Con curiosidad. Desde Madrid.</span><a href="#inicio" className="back-top" aria-label="Volver al inicio"><ArrowUp size={17}/></a></div></footer>
  </>;
}
