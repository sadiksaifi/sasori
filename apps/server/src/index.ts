import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "@sasori/env/server";
import { handleOpen, handleMessage, handleClose } from "./ws/handler";
import type { WsData } from "./ws/handler";

const app = new Hono();

app.use("*", cors({ origin: env.CORS_ORIGIN }));
app.get("/health", (c) => c.json({ ok: true }));

const server = Bun.serve<WsData>({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req, {
        data: { abortController: null },
      });
      if (upgraded) return;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return app.fetch(req);
  },
  websocket: {
    open: handleOpen,
    message: handleMessage,
    close: handleClose,
  },
});

console.log(`Server running on http://localhost:${server.port}`);
