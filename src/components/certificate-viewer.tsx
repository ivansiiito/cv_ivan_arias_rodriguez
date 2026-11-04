"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, RotateCw, X } from "lucide-react";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

type DocumentSide = { label: string; url: string };

export function CertificateViewer({ title, documents, label, locale = "es" }: { title: string; documents: DocumentSide[]; label?: string; locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  label ??= t(textos.certificados.verDiploma);
  const dialog = useRef<HTMLDialogElement>(null);
  const [flipped, setFlipped] = useState(false);
  const back = documents[1];

  function open() {
    setFlipped(false);
    dialog.current?.showModal();
  }

  return <>
    <button className="certificate-open" type="button" onClick={open} aria-label={`${label}: ${title}`}>{label} <ArrowUpRight size={16} aria-hidden="true"/></button>
    <dialog className="certificate-dialog" ref={dialog} aria-labelledby={`certificate-${documents[0].url.split("/").pop()}`} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="certificate-header"><div><span className="certificate-eyebrow">{t(textos.certificados.encabezado)}</span><h3 id={`certificate-${documents[0].url.split("/").pop()}`}>{title}</h3></div><button className="certificate-close" type="button" aria-label={t(textos.certificados.cerrar)} onClick={() => dialog.current?.close()}><X size={21}/></button></div>
      <div className="certificate-stage"><div className={`certificate-card ${flipped ? "is-flipped" : ""}`}>
        {/* Native images retain their original dimensions and can be zoomed by the browser. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="certificate-face" src={documents[0].url} alt={`${title}, ${t(textos.certificados.anverso).toLowerCase()}`} aria-hidden={flipped}/>
        {back && <div className="certificate-face certificate-back" aria-hidden={!flipped}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={back.url} alt={`${title}, ${t(textos.certificados.reverso).toLowerCase()}`}/></div>}
      </div></div>
      <div className="certificate-footer"><span aria-live="polite">{t(flipped ? textos.certificados.reverso : textos.certificados.anverso)}</span>{back && <button className="certificate-flip" type="button" onClick={() => setFlipped(!flipped)}><RotateCw size={16} aria-hidden="true"/> {t(flipped ? textos.certificados.verAnverso : textos.certificados.verReverso)}</button>}</div>
    </dialog>
  </>;
}
