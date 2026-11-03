import type { ChatTurn } from "./chat-protocol";

export class ChatProviderError extends Error {
  constructor(message: string, public readonly status = 503) {
    super(message);
    this.name = "ChatProviderError";
  }
}

function providerBaseUrl() {
  const configured = process.env.LM_STUDIO_BASE_URL?.trim() || "http://172.23.32.1:1234/v1";
  const url = new URL(configured);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new ChatProviderError("La conexión del gemelo digital necesita revisar su configuración.");
  }
  return url.href.replace(/\/$/, "");
}

function endpoint(path: string) {
  const base = providerBaseUrl();
  return `${base.endsWith("/v1") ? base : `${base}/v1`}/${path}`;
}

async function providerFetch(path: string, init: RequestInit) {
  const headers = new Headers(init.headers);
  const configuredKey = process.env.LM_STUDIO_API_KEY?.trim();
  if (configuredKey) headers.set("Authorization", `Bearer ${configuredKey}`);
  let response = await fetch(endpoint(path), { ...init, headers, cache: "no-store", redirect: "error" });

  // The existing .env key is used only if the local server actually requests it.
  const legacyKey = process.env.OPENROUTER_API_KEY?.trim();
  if ([401, 403].includes(response.status) && !configuredKey && legacyKey) {
    await response.body?.cancel();
    headers.set("Authorization", `Bearer ${legacyKey}`);
    response = await fetch(endpoint(path), { ...init, headers, cache: "no-store", redirect: "error" });
  }

  if (!response.ok) {
    await response.body?.cancel();
    if ([401, 403].includes(response.status)) throw new ChatProviderError("El servicio necesita una clave válida. Revisa la configuración de conexión e inténtalo de nuevo.");
    if (response.status === 429) throw new ChatProviderError("El gemelo está atendiendo otra solicitud. Prueba de nuevo en unos instantes.", 429);
    if (response.status === 400) throw new ChatProviderError("El modelo no ha podido procesar la conversación. Prueba con una pregunta más breve o una nueva conversación.", 502);
    throw new ChatProviderError("No he podido conectar con el modelo. Comprueba que LM Studio está abierto, con el servidor activo y un modelo de chat cargado.");
  }
  return response;
}

export async function createCompletion(system: string, messages: ChatTurn[], signal: AbortSignal) {
  // Profile questions benefit from direct answers. This is per request, not a
  // change to LM Studio's global settings. "default" leaves the model in control.
  const reasoning = process.env.LM_STUDIO_REASONING_EFFORT?.trim() || "none";
  let model = process.env.LM_STUDIO_MODEL?.trim();
  if (!model) {
    const response = await providerFetch("models", { signal: AbortSignal.any([signal, AbortSignal.timeout(8_000)]) });
    const models = await response.json() as { data?: { id?: unknown }[] };
    model = models.data?.find(item => typeof item.id === "string" && !/embed|rerank/i.test(item.id))?.id as string | undefined;
    if (!model) throw new ChatProviderError("Todavía no hay un modelo de conversación disponible. Carga uno en LM Studio y vuelve a intentarlo.");
  }
  return providerFetch("chat/completions", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.3,
      max_tokens: 1_536,
      ...(reasoning === "default" ? {} : { reasoning_effort: reasoning }),
      stream: true,
    }),
  });
}

type CompletionChunk = {
  error?: unknown;
  choices?: { delta?: { content?: string | null }; finish_reason?: string | null }[];
};

// SSE events can span network chunks; reasoning fields never leave the server.
export async function* completionEvents(response: Response): AsyncGenerator<{ text?: string; finish?: string }> {
  if (!response.body) throw new ChatProviderError("El modelo no ha devuelto una respuesta. Vuelve a intentarlo.", 502);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventLines: string[] = [];
  let finished = false;

  function parseEvent() {
    const data = eventLines.join("\n");
    eventLines = [];
    if (!data) return null;
    if (data === "[DONE]") { finished = true; return null; }
    const chunk = JSON.parse(data) as CompletionChunk;
    if (chunk.error) throw new ChatProviderError("La respuesta se ha interrumpido. Puedes volver a intentarlo.", 502);
    const choice = chunk.choices?.[0];
    if (choice?.finish_reason) finished = true;
    return { text: typeof choice?.delta?.content === "string" ? choice.delta.content : undefined, finish: choice?.finish_reason || undefined };
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (line.startsWith("data:")) eventLines.push(line.slice(5).trimStart());
        if (!line) {
          const event = parseEvent();
          if (event) yield event;
        }
      }
      if (done) break;
      if (buffer.length > 65_536) throw new ChatProviderError("El servicio ha enviado una respuesta no válida.", 502);
    }
    if (buffer.startsWith("data:")) eventLines.push(buffer.slice(5).trim());
    const lastEvent = parseEvent();
    if (lastEvent) yield lastEvent;
    if (!finished) throw new ChatProviderError("La conexión se ha interrumpido antes de completar la respuesta. Inténtalo de nuevo.", 502);
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export function providerError(error: unknown): { message: string; status: number } {
  if (error instanceof ChatProviderError) return { message: error.message, status: error.status };
  if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) {
    return { message: "El modelo está tardando demasiado en responder. Inténtalo de nuevo en unos instantes.", status: 504 };
  }
  return { message: "No he podido conectar con LM Studio. Comprueba que el servidor local sigue activo y vuelve a intentarlo.", status: 503 };
}
