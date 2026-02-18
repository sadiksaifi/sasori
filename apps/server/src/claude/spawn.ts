import { resolve } from "node:path";
import type { ServerWebSocket } from "bun";
import { parseStreamLine } from "./parser";
import { buildCliArgs, DEFAULT_CONFIG } from "./config";
import type { ServerMessage } from "../ws/protocol";

const PROJECT_ROOT = resolve(import.meta.dir, "../../../..");

function send(ws: ServerWebSocket<any>, msg: ServerMessage) {
  ws.send(JSON.stringify(msg));
}

export async function spawnClaude(
  ws: ServerWebSocket<any>,
  prompt: string,
  signal: AbortSignal,
) {
  const preview = prompt.length > 80 ? prompt.slice(0, 80) + "…" : prompt;
  console.log(`[claude] Prompt received (${prompt.length} chars): "${preview}"`);

  const args = buildCliArgs(prompt, DEFAULT_CONFIG);

  const spawnEnv = { ...process.env } as Record<string, string | undefined>;
  delete spawnEnv.CLAUDECODE;

  const proc = Bun.spawn(["claude", ...args], {
    cwd: PROJECT_ROOT,
    stderr: "pipe",
    env: spawnEnv,
  });

  console.log(`[claude] Process started (pid: ${proc.pid})`);

  // Kill on abort
  const onAbort = () => {
    proc.kill();
  };
  signal.addEventListener("abort", onAbort, { once: true });

  // Read stderr in background, accumulate for error reporting
  let stderrText = "";
  const stderrReader = (async () => {
    if (!proc.stderr) return;
    const reader = proc.stderr.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        stderrText += chunk;
        console.error("[claude stderr]", chunk.trimEnd());
      }
    } catch {
      // ignore
    }
  })();

  // Stream stdout line by line
  if (!proc.stdout) {
    send(ws, { type: "error", message: "Failed to capture stdout" });
    return;
  }

  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const msg = parseStreamLine(line);
        if (msg) {
          send(ws, msg);
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const msg = parseStreamLine(buffer);
      if (msg) {
        send(ws, msg);
      }
    }
  } catch (err) {
    if (!signal.aborted) {
      send(ws, {
        type: "error",
        message: err instanceof Error ? err.message : "Stream read error",
      });
    }
  } finally {
    signal.removeEventListener("abort", onAbort);
    await stderrReader;

    const exitCode = await proc.exited;
    console.log(`[claude] Process exited (code: ${exitCode})`);

    if (exitCode !== 0 && !signal.aborted) {
      const errMsg = stderrText.trim() || `Process exited with code ${exitCode}`;
      console.error(`[claude] Error:\n${errMsg}`);
      send(ws, { type: "error", message: errMsg });
    }
  }
}
