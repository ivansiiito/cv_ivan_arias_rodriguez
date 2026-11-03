"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, RotateCw, X } from "lucide-react";

type DocumentSide = { label: string; url: string };

export function CertificateViewer({ title, documents, label = "Ver diploma" }: { title: string; documents: DocumentSide[]; label?: string }) {
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
      <div className="certificate-header"><div><span className="certificate-eyebrow">FORMACIÓN · DOCUMENTO</span><h3 id={`certificate-${documents[0].url.split("/").pop()}`}>{title}</h3></div><button className="certificate-close" type="button" aria-label="Cerrar visor" onClick={() => dialog.current?.close()}><X size={21}/></button></div>
      <div className="certificate-stage"><div className={`certificate-card ${flipped ? "is-flipped" : ""}`}>
        {/* Native images retain their original dimensions and can be zoomed by the browser. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="certificate-face" src={documents[0].url} alt={`${title}, anverso`} aria-hidden={flipped}/>
        {back && <div className="certificate-face certificate-back" aria-hidden={!flipped}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={back.url} alt={`${title}, reverso`}/></div>}
      </div></div>
      <div className="certificate-footer"><span aria-live="polite">{flipped ? "Reverso" : "Anverso"}</span>{back && <button className="certificate-flip" type="button" onClick={() => setFlipped(!flipped)}><RotateCw size={16} aria-hidden="true"/> {flipped ? "Ver anverso" : "Ver reverso"}</button>}</div>
    </dialog>
  </>;
}
