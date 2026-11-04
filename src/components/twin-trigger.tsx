"use client";

import { ArrowUpRight, MessagesSquare } from "lucide-react";
import { OPEN_TWIN_EVENT } from "@/lib/chat-protocol";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

export function TwinTrigger({ locale = "es" }: { locale?: Locale }) {
  return (
    <button
      className="twin-inline-trigger"
      aria-haspopup="dialog"
      aria-controls="digital-twin-dialog"
      onClick={() => window.dispatchEvent(new Event(OPEN_TWIN_EVENT))}
    >
      <MessagesSquare size={17} strokeWidth={1.5} aria-hidden="true"/>
      <span>{translate(textos.invitacion.pregunta, locale)} <strong>{translate(textos.invitacion.gemelo, locale)}</strong></span>
      <ArrowUpRight size={16} aria-hidden="true"/>
    </button>
  );
}
