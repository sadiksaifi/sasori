import type { ServerWebSocket } from "bun";
import { eq } from "drizzle-orm";
import { db } from "@sasori/db";
import { chats, messages } from "@sasori/db/schema";
import { sessionManager } from "../session/manager";
import type { ClientMessage, ServerMessage } from "./protocol";

export interface WsData {
  chatId: string;
}

export function handleOpen(ws: ServerWebSocket<WsData>) {
  const { chatId } = ws.data;
  console.log(`[ws] Client connected to chat ${chatId}`);

  // Send message history
  const history = db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt)
    .all();

  const historyMsg: ServerMessage = {
    type: "history",
    messages: history.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.getTime(),
    })),
  };
  ws.send(JSON.stringify(historyMsg));

  // Subscribe to active session if one exists
  const session = sessionManager.subscribe(chatId, ws);
  if (session) {
    // Replay accumulated messages so far
    for (const msg of session.accumulatedMessages) {
      ws.send(JSON.stringify(msg));
    }
  }
}

export function handleMessage(
  ws: ServerWebSocket<WsData>,
  raw: string | Buffer,
) {
  const { chatId } = ws.data;

  let msg: ClientMessage;
  try {
    msg = JSON.parse(typeof raw === "string" ? raw : raw.toString());
  } catch {
    ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    return;
  }

  if (msg.type === "cancel") {
    console.log(`[ws] Cancel requested for chat ${chatId}`);
    sessionManager.cancelStream(chatId);
    return;
  }

  if (msg.type === "prompt") {
    console.log(`[ws] Prompt received for chat ${chatId}`);

    // Save user message to DB
    db.insert(messages)
      .values({
        id: crypto.randomUUID(),
        chatId,
        role: "user",
        content: msg.text,
      })
      .run();

    // Update chat title from first message if no title yet
    const chat = db
      .select({ title: chats.title })
      .from(chats)
      .where(eq(chats.id, chatId))
      .get();

    if (chat && !chat.title) {
      const title = msg.text.slice(0, 50);
      db.update(chats)
        .set({ title, updatedAt: new Date() })
        .where(eq(chats.id, chatId))
        .run();
    } else {
      db.update(chats)
        .set({ updatedAt: new Date() })
        .where(eq(chats.id, chatId))
        .run();
    }

    // Check if stream already active
    if (sessionManager.getSession(chatId)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "A response is already being generated",
        }),
      );
      return;
    }

    // Start stream and subscribe this WS
    const session = sessionManager.startStream(chatId, msg.text);
    session.subscribers.add(ws);
    return;
  }
}

export function handleClose(ws: ServerWebSocket<WsData>) {
  const { chatId } = ws.data;
  console.log(`[ws] Client disconnected from chat ${chatId}`);
  sessionManager.unsubscribe(chatId, ws);
}
