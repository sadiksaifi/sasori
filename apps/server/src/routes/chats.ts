import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { db } from "@sasori/db";
import { chats } from "@sasori/db/schema";
import { sessionManager } from "../session/manager";

export const chatsRouter = new Hono();

// List all chats, newest first
chatsRouter.get("/", (c) => {
  const allChats = db
    .select()
    .from(chats)
    .orderBy(desc(chats.updatedAt))
    .all();

  return c.json(
    allChats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.getTime(),
      updatedAt: chat.updatedAt.getTime(),
    })),
  );
});

// Create a new chat
chatsRouter.post("/", (c) => {
  const id = crypto.randomUUID();
  const now = new Date();

  db.insert(chats)
    .values({
      id,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  return c.json({
    id,
    title: null,
    createdAt: now.getTime(),
    updatedAt: now.getTime(),
  });
});

// Get chatIds with active streams
chatsRouter.get("/streaming", (c) => {
  return c.json(sessionManager.getActiveSessionIds());
});

// Delete a chat
chatsRouter.delete("/:id", (c) => {
  const id = c.req.param("id");

  // Cancel active stream if any
  sessionManager.cancelStream(id);

  db.delete(chats).where(eq(chats.id, id)).run();

  return c.json({ ok: true });
});
