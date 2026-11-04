"use client";

import { ArrowDown, ArrowUp, ArrowUpRight, MessageCircle, Plus, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { conversationContext, MAX_QUESTION_LENGTH, OPEN_TWIN_EVENT, type ChatEvent, type ChatTurn } from "@/lib/chat-protocol";
import { BrandMark } from "./brand-mark";
import textos from "@/i18n/textos.json";
import { translate, type Locale } from "@/i18n/locale";

type Message = ChatTurn & {
  id: string;
  state: "complete" | "streaming" | "error" | "stopped";
  error?: string;
  truncated?: boolean;
};

function completedHistory(messages: Message[]): ChatTurn[] {
  const history: ChatTurn[] = [];
  for (let index = 0; index < messages.length - 1; index += 2) {
    const user = messages[index];
    const assistant = messages[index + 1];
    if (user.role === "user" && assistant.role === "assistant" && assistant.state === "complete" && assistant.content.trim()) {
      history.push({ role: "user", content: user.content }, { role: "assistant", content: assistant.content });
    }
  }
  return history;
}

export function DigitalTwin({ locale = "es" }: { locale?: Locale }) {
  const t = (text: { es: string; en?: string }) => translate(text, locale);
  const copy = textos.gemelo;
  const suggestions = [copy.sugerenciaNokia, copy.sugerenciaLenguaje, copy.sugerenciaFormacion, copy.sugerenciaEmpresas].map(t);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const requestVersion = useRef(0);
  const followBottom = useRef(true);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [awayFromBottom, setAwayFromBottom] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const showDialog = useCallback(() => {
    if (dialog.current?.open) return;
    dialog.current?.showModal();
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_TWIN_EVENT, showDialog);
    return () => {
      window.removeEventListener(OPEN_TWIN_EVENT, showDialog);
      abort.current?.abort();
    };
  }, [showDialog]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useLayoutEffect(() => {
    if (followBottom.current && transcript.current) transcript.current.scrollTop = messages.length ? transcript.current.scrollHeight : 0;
  }, [messages, open, busy]);

  useLayoutEffect(() => {
    if (!input.current) return;
    input.current.style.height = "auto";
    input.current.style.height = `${Math.min(input.current.scrollHeight, 114)}px`;
  }, [draft, open]);

  function updateMessage(id: string, update: Partial<Message>) {
    setMessages(current => current.map(message => message.id === id ? { ...message, ...update } : message));
  }

  async function sendQuestion(question = draft, previousMessages = messages) {
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH || abort.current) return;
    const version = ++requestVersion.current;
    const controller = new AbortController();
    abort.current = controller;
    const assistantId = crypto.randomUUID();
    const nextMessages: Message[] = [
      ...previousMessages,
      { id: crypto.randomUUID(), role: "user", content: text, state: "complete" },
      { id: assistantId, role: "assistant", content: "", state: "streaming" },
    ];
    setMessages(nextMessages);
    setDraft("");
    setBusy(true);
    setAnnouncement(t(copy.preparando));
    followBottom.current = true;
    setAwayFromBottom(false);
    let answer = "";
    let receivedDone = false;

    try {
      const response = await fetch("/api/gemelo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(130_000)]),
        body: JSON.stringify({ messages: conversationContext(completedHistory(previousMessages), text) }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(locale === "es" && result?.error ? result.error : t(copy.errorInicio));
      }
      if (!response.body) throw new Error(t(copy.sinRespuesta));
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pending = "";

      function consume(line: string) {
        if (!line.trim() || version !== requestVersion.current) return;
        const event = JSON.parse(line) as ChatEvent;
        if (event.type === "error") throw new Error(locale === "es" ? event.message : t(copy.errorInicio));
        if (event.type === "delta") {
          answer += event.text;
          updateMessage(assistantId, { content: answer.trimStart() });
        }
        if (event.type === "done") {
          receivedDone = true;
          updateMessage(assistantId, { state: "complete", truncated: event.truncated });
          setAnnouncement(`${t(copy.haRespondido)} ${answer.trim()}`);
        }
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (version !== requestVersion.current) break;
          pending += decoder.decode(value, { stream: !done });
          let newline: number;
          while ((newline = pending.indexOf("\n")) !== -1) {
            consume(pending.slice(0, newline));
            pending = pending.slice(newline + 1);
          }
          if (done) { consume(pending); break; }
        }
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
      if (!receivedDone && version === requestVersion.current) throw new Error(t(copy.interrumpida));
    } catch (error) {
      if (version !== requestVersion.current) return;
      if (controller.signal.aborted) {
        updateMessage(assistantId, { state: "stopped" });
        setAnnouncement(t(copy.detenida));
      } else {
        const message = error instanceof Error && error.name === "TimeoutError"
          ? t(copy.tiempoAgotado)
          : error instanceof Error && error.name !== "TypeError" && error.name !== "SyntaxError"
            ? error.message
            : t(copy.sinConexion);
        updateMessage(assistantId, { state: "error", error: message });
        setAnnouncement(message);
      }
    } finally {
      if (version === requestVersion.current) {
        abort.current = null;
        setBusy(false);
      }
    }
  }

  function resetConversation() {
    requestVersion.current++;
    abort.current?.abort();
    abort.current = null;
    setMessages([]);
    setDraft("");
    setBusy(false);
    followBottom.current = true;
    setAwayFromBottom(false);
    setAnnouncement(t(copy.conversacionIniciada));
    input.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void sendQuestion(); }

  return <>
    <button className="twin-launcher" onClick={showDialog} aria-haspopup="dialog" aria-controls="digital-twin-dialog">
      <span className="twin-launcher-icon"><MessageCircle size={20} strokeWidth={1.6} aria-hidden="true"/><span/></span>
      <span>{t(copy.abrir)} <span className="twin-ai-label">{t(copy.sigla)}</span></span>
    </button>

    <dialog
      ref={dialog}
      id="digital-twin-dialog"
      className="twin-dialog"
      aria-labelledby="twin-dialog-title"
      aria-describedby="twin-disclosure"
      onClose={() => setOpen(false)}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close();
      }}
    >
      <div className="twin-panel">
        <header className="twin-header">
          <BrandMark/>
          <div className="twin-title"><h2 id="twin-dialog-title">{t(copy.titulo)}</h2><p>{t(copy.subtitulo)}</p></div>
          <button className="twin-icon-button" onClick={resetConversation} disabled={!messages.length && !draft} aria-label={t(copy.nuevaConversacion)} title={t(copy.nuevaConversacion)}><Plus size={19}/></button>
          <button className="twin-icon-button" onClick={() => dialog.current?.close()} aria-label={t(copy.cerrarConversacion)} title={t(copy.cerrar)}><X size={19}/></button>
        </header>

        <div className="twin-disclosure" id="twin-disclosure"><Sparkles size={13} aria-hidden="true"/><p>{t(copy.aviso)}</p></div>

        <div
          ref={transcript}
          className="twin-transcript"
          role="log"
          aria-label={t(copy.etiquetaConversacion)}
          aria-live="off"
          tabIndex={0}
          onScroll={() => {
            if (!transcript.current) return;
            const { scrollHeight, scrollTop, clientHeight } = transcript.current;
            followBottom.current = scrollHeight - scrollTop - clientHeight < 85;
            setAwayFromBottom(!followBottom.current);
          }}
        >
          {!messages.length && <div className="twin-welcome">
            <div className="twin-welcome-brand"><BrandMark/></div>
            <span className="twin-eyebrow">{t(copy.encabezado)}</span>
            <h3>{t(copy.pregunta)}<br/>{t(copy.conexiones)}</h3>
            <p>{t(copy.bienvenida)}</p>
            <div className="twin-suggestions" aria-label={t(copy.sugerencias)}>{suggestions.map(question => <button key={question} onClick={() => void sendQuestion(question)}>{question}<ArrowUpRight size={16} aria-hidden="true"/></button>)}</div>
          </div>}

          {messages.map((message, index) => <div key={message.id} className={`twin-message twin-message-${message.role}`}>
            <span className="twin-message-author">{t(message.role === "user" ? copy.usuario : copy.asistente)}</span>
            {message.content && <div className="twin-message-text">{message.content}</div>}
            {message.state === "streaming" && !message.content.trim() && <div className="twin-thinking"><span><i/><i/><i/></span>{t(copy.pensando)}</div>}
            {message.state === "stopped" && <p className="twin-message-note">{t(copy.detenida)}</p>}
            {message.truncated && <p className="twin-message-note">{t(copy.limite)}</p>}
            {message.state === "error" && <div className="twin-error"><p>{message.error}</p>{index === messages.length - 1 && <button disabled={busy} onClick={() => void sendQuestion(messages[index - 1].content, messages.slice(0, index - 1))}><RotateCcw size={14} aria-hidden="true"/>{t(copy.reintentar)}</button>}</div>}
          </div>)}
        </div>

        {awayFromBottom && <button className="twin-scroll-latest" onClick={() => { followBottom.current = true; setAwayFromBottom(false); if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }}><ArrowDown size={14} aria-hidden="true"/>{t(copy.ultimoMensaje)}</button>}

        <form className="twin-composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="twin-question">{t(copy.tuPregunta)}</label>
          <div className="twin-input-wrap"><textarea
            ref={input}
            id="twin-question"
            placeholder={t(copy.placeholder)}
            rows={1}
            maxLength={MAX_QUESTION_LENGTH}
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) void sendQuestion(); } }}
            aria-describedby="twin-input-help"
          />{busy ? <button type="button" className="twin-send" onClick={() => abort.current?.abort()} aria-label={t(copy.detener)} title={t(copy.detener)}><Square size={14} fill="currentColor"/></button> : <button type="submit" className="twin-send" disabled={!draft.trim()} aria-label={t(copy.enviar)} title={t(copy.enviar)}><ArrowUp size={20}/></button>}</div>
          <div className="twin-composer-meta" id="twin-input-help"><span>{t(copy.ayuda)}</span><span>{draft.length}/{MAX_QUESTION_LENGTH}</span></div>
          <p className="twin-privacy">{t(copy.privacidad)}</p>
        </form>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
    </dialog>
  </>;
}
