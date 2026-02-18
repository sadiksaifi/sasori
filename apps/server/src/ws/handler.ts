import type { ServerWebSocket } from "bun";
import { spawnClaude } from "../claude/spawn";
import type { ClientMessage } from "./protocol";

export interface WsData {
  abortController: AbortController | null;
}

function killExisting(ws: ServerWebSocket<WsData>) {
  const data = ws.data;
  if (data.abortController) {
    data.abortController.abort();
    data.abortController = null;
  }
}

export function handleOpen(_ws: ServerWebSocket<WsData>) {
  console.log("[ws] Client connected");
}

export function handleMessage(
  ws: ServerWebSocket<WsData>,
  raw: string | Buffer,
) {
  let msg: ClientMessage;
  try {
    msg = JSON.parse(typeof raw === "string" ? raw : raw.toString());
  } catch {
    ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    return;
  }

  if (msg.type === "cancel") {
    console.log("[ws] Received cancel");
    killExisting(ws);
    ws.send(JSON.stringify({ type: "cancelled" }));
    return;
  }

  if (msg.type === "prompt") {
    console.log("[ws] Received prompt");
    // Kill any running process first
    killExisting(ws);

    const controller = new AbortController();
    ws.data.abortController = controller;

    spawnClaude(ws, msg.text, controller.signal).finally(() => {
      // Clear if this is still the active controller
      if (ws.data.abortController === controller) {
        ws.data.abortController = null;
      }
    });
    return;
  }
}

export function handleClose(ws: ServerWebSocket<WsData>) {
  console.log("[ws] Client disconnected");
  killExisting(ws);
}
