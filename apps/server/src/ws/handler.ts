import type { ServerWebSocket } from "bun";
import { eq, sql } from "drizzle-orm";
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
    if (session.accumulatedText) {
      ws.send(JSON.stringify({ type: "stream_resume", accumulatedText: session.accumulatedText }));
    } else {
      ws.send(JSON.stringify({ type: "stream_active" }));
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

    // Save user message to DB and update chat
    try {
      db.insert(messages)
        .values({
          id: crypto.randomUUID(),
          chatId,
          role: "user",
          content: msg.text,
        })
        .run();

      // Set title from first message (COALESCE keeps existing title)
      const title = msg.text.slice(0, 50);
      db.update(chats)
        .set({
          title: sql`COALESCE(${chats.title}, ${title})`,
          updatedAt: new Date(),
        })
        .where(eq(chats.id, chatId))
        .run();
    } catch (err) {
      console.error(`[ws] Failed to save user message for chat ${chatId}:`, err);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Failed to save message. Please try again.",
        }),
      );
      return;
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
