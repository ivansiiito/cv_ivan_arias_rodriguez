"use client";

import { useEffect, useState } from "react";

const disciplines = ["Ingeniería", "Lingüística", "Inteligencia artificial"];
// Vista temporal para ajustar los iconos. Cambiar a false recupera la animación.
const previewIcons = false;
export function DisciplineAnimation() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<"typing" | "transition">("typing");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || previewIcons) return;
    const text = disciplines[index];
    let delay = 90;
    if (phase === "typing" && length === text.length) delay = 1000;
    else if (phase === "transition") delay = 2100;
    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        if (length < text.length) setLength(length + 1);
        else {
          setIconIndex((index + 1) % disciplines.length);
          setPhase("transition");
        }
      } else if (phase === "transition") {
        setIndex(iconIndex);
        setLength(0);
        setPhase("typing");
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [index, iconIndex, length, phase, reducedMotion]);

  return <div className={`discipline-sequence${previewIcons ? " is-editing-icons" : ""}`}>
    <span className="sr-only">Ingeniería, Lingüística e Inteligencia artificial.</span>
    <div className="discipline-sequence-motion" aria-hidden="true">
      <span className="discipline-icon" aria-hidden="true">
        <span className={`discipline-icon-layer${iconIndex === 0 ? " is-active" : ""}`}>
          {/* Ajuste manual de ingeniería: x/y sitúan cada carácter; fontSize cambia su tamaño. */}
          <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor" className="discipline-code">
            <text x="8" y="10" textAnchor="middle" dominantBaseline="central" fontSize="28">{"<"}</text>
            <text x="19" y="11" textAnchor="middle" dominantBaseline="central" fontSize="13" transform="rotate(15 19 11)">{"/"}</text>
            <text x="27" y="10" textAnchor="middle" dominantBaseline="central" fontSize="18">{">"}</text>
          </svg>
        </span>
        <span className={`discipline-icon-layer${iconIndex === 1 ? " is-active" : ""}`}>
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M2 11v2M5 9v6M8 7v10M11 2v20M14 7v10M17 9v6M20 11v2M22.5 9.5v5M25 6v12M27.5 9.5v5M30 11v2"/>
          </svg>
        </span>
        <span className={`discipline-icon-layer${iconIndex === 2 ? " is-active" : ""}`}>
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 2C12.4 9 13.4 10.8 20 12c-6.6 1.2-7.6 3-9 10-1.4-7-2.4-8.8-9-10C8.6 10.8 9.6 9 11 2ZM25 6c.8 4 1.4 5.2 5 6-3.6.8-4.2 2-5 6-.8-4-1.4-5.2-5-6 3.6-.8 4.2-2 5-6Z"/>
          </svg>
        </span>
      </span>
      {!previewIcons && <span className={`discipline-sequence-text${phase === "transition" ? " is-fading" : ""}`}>{disciplines[index].slice(0, length)}</span>}
    </div>
    <div className="discipline-sequence-static" aria-hidden="true">Ingeniería · Lingüística · Inteligencia artificial</div>
  </div>;
}
