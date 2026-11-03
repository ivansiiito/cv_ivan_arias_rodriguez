import { test, expect } from "@playwright/test";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { completionEvents, createCompletion, ChatProviderError } from "../src/lib/lm-studio";
import { twinSystemPrompt } from "../src/lib/twin-knowledge";
import { conversationContext, MAX_HISTORY_LENGTH } from "../src/lib/chat-protocol";

async function withProvider(handler: (request: IncomingMessage, response: ServerResponse) => void, run: () => Promise<void>) {
  const original = { url: process.env.LM_STUDIO_BASE_URL, model: process.env.LM_STUDIO_MODEL, key: process.env.LM_STUDIO_API_KEY, legacy: process.env.OPENROUTER_API_KEY };
  const server = createServer(handler);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  process.env.LM_STUDIO_BASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  delete process.env.LM_STUDIO_MODEL;
  delete process.env.LM_STUDIO_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  try { await run(); }
  finally {
    for (const [key, value] of Object.entries({ LM_STUDIO_BASE_URL: original.url, LM_STUDIO_MODEL: original.model, LM_STUDIO_API_KEY: original.key, OPENROUTER_API_KEY: original.legacy })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}

test("provider: discovers chat model, sends profile only server-side, no unsolicited auth", async () => {
  let payload: { model: string; messages: { role: string; content: string }[]; stream: boolean; reasoning_effort?: string } | undefined;
  const auth: (string | undefined)[] = [];
  await withProvider((request, response) => {
    auth.push(request.headers.authorization);
    if (request.url === "/v1/models") return void response.end(JSON.stringify({ data: [{ id: "text-embedding-demo" }, { id: "local-chat-model" }] }));
    let body = "";
    request.on("data", chunk => { body += chunk; });
    request.on("end", () => {
      payload = JSON.parse(body);
      response.setHeader("Content-Type", "text/event-stream");
      response.end('data: {"choices":[{"delta":{"content":"Hola"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n');
    });
  }, async () => {
    process.env.OPENROUTER_API_KEY = "test-fallback-token";
    const response = await createCompletion(twinSystemPrompt(), [{ role: "user", content: "¿Qué hiciste en Nokia?" }], AbortSignal.timeout(5_000));
    const events = [];
    for await (const event of completionEvents(response)) events.push(event);
    expect(events).toContainEqual({ text: "Hola", finish: "stop" });
    expect(payload?.model).toBe("local-chat-model");
    expect(payload?.reasoning_effort).toBe("none");
    expect(payload?.messages[0].role).toBe("system");
    expect(payload?.messages[0].content).toContain("octubre de 2026");
    expect(payload?.messages[0].content).toContain("Nokia");
    expect(JSON.stringify(payload)).not.toContain("test-fallback-token");
    expect(auth).toEqual([undefined, undefined]);
  });
});

test("provider: retries auth only when requested and masks upstream error bodies", async () => {
  const auth: (string | undefined)[] = [];
  await withProvider((request, response) => {
    auth.push(request.headers.authorization);
    if (!request.headers.authorization) { response.statusCode = 401; return void response.end("auth required"); }
    response.statusCode = 503;
    response.end("INTERNAL SECRET SHOULD NOT REACH THE BROWSER");
  }, async () => {
    process.env.LM_STUDIO_MODEL = "pinned-model";
    process.env.OPENROUTER_API_KEY = "test-fallback-token";
    await expect(createCompletion("Profile", [{ role: "user", content: "Hola" }], AbortSignal.timeout(5_000))).rejects.toThrow(/No he podido conectar/);
    expect(auth).toEqual([undefined, "Bearer test-fallback-token"]);
  });
});

test("provider: preserves split UTF-8 SSE, ignores reasoning, detects interrupted stream", async () => {
  const raw = [
    'data: {"choices":[{"delta":{"reasoning_content":"Private reasoning"}}]}\r\n\r\n',
    'data: {"choices":[{"delta":{"content":"Iván estudió lingüística."}}]}\r\n\r\n',
    'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\r\n\r\n',
    'data: [DONE]\r\n\r\n',
  ].join("");
  const bytes = new TextEncoder().encode(raw);
  const stream = new ReadableStream<Uint8Array>({ start(controller) { for (let offset = 0; offset < bytes.length; offset += 3) controller.enqueue(bytes.slice(offset, offset + 3)); controller.close(); } });
  let text = "";
  for await (const event of completionEvents(new Response(stream))) text += event.text || "";
  expect(text).toBe("Iván estudió lingüística.");
  const broken = new Response('data: {"choices":[{"delta":{"content":"Partial"}}]}\n\n');
  await expect(async () => { for await (const event of completionEvents(broken)) void event; }).rejects.toBeInstanceOf(ChatProviderError);
});

test("conversation budget keeps whole exchanges and the latest question", () => {
  const history = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? "assistant" as const : "user" as const, content: "x".repeat(1_500) }));
  const context = conversationContext(history, "Mi última pregunta");
  expect(context.at(-1)?.content).toBe("Mi última pregunta");
  expect(context.length % 2).toBe(1);
  expect(context.reduce((size, item) => size + item.content.length, 0)).toBeLessThanOrEqual(MAX_HISTORY_LENGTH);
  expect(context.every((item, index) => item.role === (index % 2 ? "assistant" : "user"))).toBe(true);
});
