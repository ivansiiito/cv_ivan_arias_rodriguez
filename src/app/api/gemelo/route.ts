import { MAX_CHAT_MESSAGES, MAX_HISTORY_LENGTH, MAX_QUESTION_LENGTH, type ChatEvent, type ChatTurn } from "@/lib/chat-protocol";
import { ChatProviderError, completionEvents, createCompletion, providerError } from "@/lib/lm-studio";
import { twinSystemPrompt } from "@/lib/twin-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function validConversation(input: unknown): input is { messages: ChatTurn[] } {
  if (!input || typeof input !== "object" || !("messages" in input) || !Array.isArray(input.messages)) return false;
  const messages: unknown[] = input.messages;
  if (!messages.length || messages.length > MAX_CHAT_MESSAGES || messages.length % 2 !== 1) return false;
  let length = 0;
  return messages.every((turn, index) => {
    if (!turn || typeof turn !== "object" || !("role" in turn) || !("content" in turn)) return false;
    if (turn.role !== (index % 2 === 0 ? "user" : "assistant") || typeof turn.content !== "string" || !turn.content.trim()) return false;
    length += turn.content.length;
    return turn.content.length <= (turn.role === "user" ? MAX_QUESTION_LENGTH : 8_000) && length <= MAX_HISTORY_LENGTH;
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next can normalize request.url to localhost even when the browser uses 127.0.0.1.
  // The incoming Host retains the actual address the visitor opened.
  if (origin) {
    try {
      const source = new URL(origin);
      const host = request.headers.get("host") || new URL(request.url).host;
      if (source.host !== host || !["http:", "https:"].includes(source.protocol)) return jsonError("Esta conversación debe iniciarse desde la web de Iván.", 403);
    } catch { return jsonError("El origen de la conversación no es válido.", 403); }
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return jsonError("La solicitud debe contener una conversación válida.", 415);

  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return jsonError("Escribe una pregunta para comenzar.", 400);
    const decoder = new TextDecoder();
    let body = "";
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 65_536) { await reader.cancel(); return jsonError("La conversación es demasiado larga. Inicia una nueva.", 413); }
        body += decoder.decode(value, { stream: true });
      }
      input = JSON.parse(body + decoder.decode());
    } finally { reader.releaseLock(); }
  } catch { return jsonError("No he podido leer la pregunta. Inténtalo de nuevo.", 400); }

  if (!validConversation(input)) return jsonError("La conversación no es válida o supera el límite. Escribe una pregunta de hasta 2.000 caracteres.", 400);
  const messages = input.messages.map(({ role, content }) => ({ role, content: content.trim() }));
  const upstreamController = new AbortController();
  const signal = AbortSignal.any([request.signal, upstreamController.signal, AbortSignal.timeout(120_000)]);

  try {
    const upstream = await createCompletion(twinSystemPrompt(), messages, signal);
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        let hasText = false;
        let truncated = false;
        function send(event: ChatEvent) { controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); }
        try {
          for await (const event of completionEvents(upstream)) {
            if (event.text) {
              if (event.text.trim()) hasText = true;
              send({ type: "delta", text: event.text });
            }
            if (event.finish === "length") truncated = true;
          }
          if (!hasText) throw new ChatProviderError("El modelo no ha devuelto una respuesta de texto. Prueba de nuevo o inicia otra conversación.", 502);
          send({ type: "done", truncated });
        } catch (error) {
          if (!upstreamController.signal.aborted && !request.signal.aborted) send({ type: "error", message: providerError(error).message });
        } finally {
          if (!upstreamController.signal.aborted) controller.close();
        }
      },
      cancel() { upstreamController.abort(); },
    });
    return new Response(body, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" } });
  } catch (error) {
    const failure = providerError(error);
    return jsonError(failure.message, failure.status);
  }
}
