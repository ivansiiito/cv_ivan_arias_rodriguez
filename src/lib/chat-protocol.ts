export const OPEN_TWIN_EVENT = "open-ivan-digital-twin";
export const MAX_QUESTION_LENGTH = 2_000;
export const MAX_CHAT_MESSAGES = 19;
export const MAX_HISTORY_LENGTH = 18_000;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatEvent =
  | { type: "delta"; text: string }
  | { type: "done"; truncated: boolean }
  | { type: "error"; message: string };

// Keep complete exchanges together when the conversation exceeds the context budget.
export function conversationContext(history: ChatTurn[], question: string): ChatTurn[] {
  const recent = [...history.slice(-(MAX_CHAT_MESSAGES - 1)), { role: "user" as const, content: question }];
  while (recent.length > 1 && recent.reduce((length, turn) => length + turn.content.length, 0) > MAX_HISTORY_LENGTH) {
    recent.splice(0, 2);
  }
  return recent;
}
