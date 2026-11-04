"use client";

import { ArrowUpRight, MessagesSquare } from "lucide-react";
import { OPEN_TWIN_EVENT } from "@/lib/chat-protocol";

export function TwinTrigger() {
  return (
    <button
      className="twin-inline-trigger"
      aria-haspopup="dialog"
      aria-controls="digital-twin-dialog"
      onClick={() => window.dispatchEvent(new Event(OPEN_TWIN_EVENT))}
    >
      <MessagesSquare size={17} strokeWidth={1.5} aria-hidden="true"/>
      <span>¿Quieres conocerme mejor? <strong>Habla con IA, mi gemelo digital.</strong></span>
      <ArrowUpRight size={16} aria-hidden="true"/>
    </button>
  );
}
