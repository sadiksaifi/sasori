import type { ServerWebSocket } from "bun";
import { db } from "@sasori/db";
import { messages } from "@sasori/db/schema";
import { spawnClaude } from "../claude/spawn";
import type { ServerMessage } from "../ws/protocol";

interface ActiveSession {
  chatId: string;
  abort: () => void;
  done: Promise<void>;
  accumulatedText: string;
  accumulatedMessages: ServerMessage[];
  subscribers: Set<ServerWebSocket<any>>;
}

class SessionManager {
  private sessions = new Map<string, ActiveSession>();

  subscribe(chatId: string, ws: ServerWebSocket<any>): ActiveSession | null {
    const session = this.sessions.get(chatId);
    if (session) {
      session.subscribers.add(ws);
      return session;
    }
    return null;
  }

  unsubscribe(chatId: string, ws: ServerWebSocket<any>): void {
    const session = this.sessions.get(chatId);
    if (session) {
      session.subscribers.delete(ws);
    }
  }

  startStream(chatId: string, prompt: string): ActiveSession {
    const existing = this.sessions.get(chatId);
    if (existing) {
      throw new Error("Stream already active for this chat");
    }

    const controller = new AbortController();

    const session: ActiveSession = {
      chatId,
      abort: () => controller.abort(),
      done: Promise.resolve(),
      accumulatedText: "",
      accumulatedMessages: [],
      subscribers: new Set(),
    };

    const broadcast = (msg: ServerMessage) => {
      session.accumulatedMessages.push(msg);
      const json = JSON.stringify(msg);
      for (const ws of session.subscribers) {
        ws.send(json);
      }
    };

    const onDelta = (text: string) => {
      session.accumulatedText += text;
    };

    session.done = spawnClaude(broadcast, prompt, controller.signal, onDelta)
      .then(async () => {
        // Save assistant message to DB if we got any text
        if (session.accumulatedText) {
          await db.insert(messages).values({
            id: crypto.randomUUID(),
            chatId,
            role: "assistant",
            content: session.accumulatedText,
          });
        }
      })
      .catch((err) => {
        console.error(`[session] Stream error for chat ${chatId}:`, err);
      })
      .finally(() => {
        this.sessions.delete(chatId);
      });

    this.sessions.set(chatId, session);
    return session;
  }

  cancelStream(chatId: string): void {
    const session = this.sessions.get(chatId);
    if (session) {
      session.abort();
      const msg: ServerMessage = { type: "cancelled" };
      const json = JSON.stringify(msg);
      for (const ws of session.subscribers) {
        ws.send(json);
      }
    }
  }

  getSession(chatId: string): ActiveSession | null {
    return this.sessions.get(chatId) ?? null;
  }

  getActiveSessionIds(): string[] {
    return Array.from(this.sessions.keys());
  }
}

export const sessionManager = new SessionManager();
