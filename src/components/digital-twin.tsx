"use client";

import { ArrowDown, ArrowUp, ArrowUpRight, MessageCircle, Plus, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { conversationContext, MAX_QUESTION_LENGTH, OPEN_TWIN_EVENT, type ChatEvent, type ChatTurn } from "@/lib/chat-protocol";
import { BrandMark } from "./brand-mark";

type Message = ChatTurn & {
  id: string;
  state: "complete" | "streaming" | "error" | "stopped";
  error?: string;
  truncated?: boolean;
};

const suggestions = [
  "¿Qué hiciste en Nokia?",
  "¿Cómo conectas lenguaje e IA?",
  "Cuéntame tu formación",
  "¿Qué empresas has cofundado?",
];

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

export function DigitalTwin() {
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
    setAnnouncement("El gemelo digital está preparando una respuesta.");
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
        throw new Error(result?.error || "No se ha podido iniciar la conversación. Inténtalo de nuevo.");
      }
      if (!response.body) throw new Error("No se ha recibido una respuesta. Vuelve a intentarlo.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pending = "";

      function consume(line: string) {
        if (!line.trim() || version !== requestVersion.current) return;
        const event = JSON.parse(line) as ChatEvent;
        if (event.type === "error") throw new Error(event.message);
        if (event.type === "delta") {
          answer += event.text;
          updateMessage(assistantId, { content: answer.trimStart() });
        }
        if (event.type === "done") {
          receivedDone = true;
          updateMessage(assistantId, { state: "complete", truncated: event.truncated });
          setAnnouncement(`El gemelo digital ha respondido: ${answer.trim()}`);
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
      if (!receivedDone && version === requestVersion.current) throw new Error("La respuesta se ha interrumpido. Puedes volver a intentarlo.");
    } catch (error) {
      if (version !== requestVersion.current) return;
      if (controller.signal.aborted) {
        updateMessage(assistantId, { state: "stopped" });
        setAnnouncement("Respuesta detenida.");
      } else {
        const message = error instanceof Error && error.name === "TimeoutError"
          ? "La respuesta está tardando demasiado. Prueba de nuevo en unos instantes."
          : error instanceof Error && error.name !== "TypeError" && error.name !== "SyntaxError"
            ? error.message
            : "Se ha perdido la conexión con el servicio. Puedes volver a intentarlo.";
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
    setAnnouncement("Nueva conversación iniciada.");
    input.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void sendQuestion(); }

  return <>
    <button className="twin-launcher" onClick={showDialog} aria-haspopup="dialog" aria-controls="digital-twin-dialog">
      <span className="twin-launcher-icon"><MessageCircle size={20} strokeWidth={1.6} aria-hidden="true"/><span/></span>
      <span>Habla con mi gemelo <span className="twin-ai-label">IA</span></span>
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
          <div className="twin-title"><h2 id="twin-dialog-title">Iván, en digital.</h2><p>Mi trayectoria, en conversación.</p></div>
          <button className="twin-icon-button" onClick={resetConversation} disabled={!messages.length && !draft} aria-label="Nueva conversación" title="Nueva conversación"><Plus size={19}/></button>
          <button className="twin-icon-button" onClick={() => dialog.current?.close()} aria-label="Cerrar conversación" title="Cerrar"><X size={19}/></button>
        </header>

        <div className="twin-disclosure" id="twin-disclosure"><Sparkles size={13} aria-hidden="true"/><p>Soy un gemelo de IA basado en el perfil de Iván. Puedo equivocarme.</p></div>

        <div
          ref={transcript}
          className="twin-transcript"
          role="log"
          aria-label="Conversación con el gemelo digital"
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
            <span className="twin-eyebrow">OTRA FORMA DE CONOCERME</span>
            <h3>Una pregunta.<br/>Muchas conexiones.</h3>
            <p>Soy el gemelo digital de Iván Arias Rodríguez: sus iniciales son IA y yo soy su IA. Pregúntame por su trayectoria, sus proyectos o cómo conecta ingeniería y lenguaje.</p>
            <div className="twin-suggestions" aria-label="Preguntas sugeridas">{suggestions.map(question => <button key={question} onClick={() => void sendQuestion(question)}>{question}<ArrowUpRight size={16} aria-hidden="true"/></button>)}</div>
          </div>}

          {messages.map((message, index) => <div key={message.id} className={`twin-message twin-message-${message.role}`}>
            <span className="twin-message-author">{message.role === "user" ? "TÚ" : "IVÁN · GEMELO DIGITAL"}</span>
            {message.content && <div className="twin-message-text">{message.content}</div>}
            {message.state === "streaming" && !message.content.trim() && <div className="twin-thinking"><span><i/><i/><i/></span>Conectando los puntos…</div>}
            {message.state === "stopped" && <p className="twin-message-note">Respuesta detenida.</p>}
            {message.truncated && <p className="twin-message-note">La respuesta ha alcanzado su límite. Puedes pedirme que continúe.</p>}
            {message.state === "error" && <div className="twin-error"><p>{message.error}</p>{index === messages.length - 1 && <button disabled={busy} onClick={() => void sendQuestion(messages[index - 1].content, messages.slice(0, index - 1))}><RotateCcw size={14} aria-hidden="true"/>Volver a intentar</button>}</div>}
          </div>)}
        </div>

        {awayFromBottom && <button className="twin-scroll-latest" onClick={() => { followBottom.current = true; setAwayFromBottom(false); if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }}><ArrowDown size={14} aria-hidden="true"/>Ir al último mensaje</button>}

        <form className="twin-composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="twin-question">Tu pregunta sobre Iván</label>
          <div className="twin-input-wrap"><textarea
            ref={input}
            id="twin-question"
            placeholder="¿Qué te gustaría saber?"
            rows={1}
            maxLength={MAX_QUESTION_LENGTH}
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) void sendQuestion(); } }}
            aria-describedby="twin-input-help"
          />{busy ? <button type="button" className="twin-send" onClick={() => abort.current?.abort()} aria-label="Detener respuesta" title="Detener respuesta"><Square size={14} fill="currentColor"/></button> : <button type="submit" className="twin-send" disabled={!draft.trim()} aria-label="Enviar pregunta" title="Enviar pregunta"><ArrowUp size={20}/></button>}</div>
          <div className="twin-composer-meta" id="twin-input-help"><span>Enter para enviar · Mayús + Enter para nueva línea</span><span>{draft.length}/{MAX_QUESTION_LENGTH}</span></div>
          <p className="twin-privacy">Historial temporal en esta pestaña · Basado en mi perfil profesional</p>
        </form>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
    </dialog>
  </>;
}
