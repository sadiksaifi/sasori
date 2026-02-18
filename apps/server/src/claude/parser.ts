import type { ServerMessage } from "../ws/protocol";

export function parseStreamLine(line: string): ServerMessage | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }

  const type = parsed.type as string | undefined;

  // Stream events contain content deltas for real-time streaming
  if (type === "content_block_delta") {
    const delta = parsed.delta;
    if (delta?.type === "text_delta" && typeof delta.text === "string") {
      return { type: "text_delta", text: delta.text };
    }
    return null;
  }

  // Assistant message with tool_use content blocks
  if (type === "assistant") {
    const content = parsed.message?.content ?? parsed.content;
    if (!Array.isArray(content)) return null;

    for (const block of content) {
      if (block.type === "tool_use") {
        return {
          type: "tool_use",
          tool: block.name ?? "unknown",
          input:
            typeof block.input === "string"
              ? block.input
              : JSON.stringify(block.input),
        };
      }
    }
    return null;
  }

  // Tool result messages
  if (type === "user") {
    const content = parsed.message?.content ?? parsed.content;
    if (!Array.isArray(content)) return null;

    for (const block of content) {
      if (block.type === "tool_result") {
        const output =
          typeof block.content === "string"
            ? block.content
            : JSON.stringify(block.content);
        return {
          type: "tool_result",
          tool: block.tool_use_id ?? "unknown",
          output,
        };
      }
    }
    return null;
  }

  // Final result
  if (type === "result") {
    if (parsed.subtype === "success") {
      const result =
        typeof parsed.result === "string"
          ? parsed.result
          : JSON.stringify(parsed.result ?? "");
      return { type: "done", result };
    }
    // Error results
    const errorMsg =
      parsed.error?.message ??
      (Array.isArray(parsed.errors)
        ? parsed.errors.map((e: any) => e.message ?? String(e)).join("; ")
        : "Unknown error");
    return { type: "error", message: errorMsg };
  }

  // Skip system, status, and other event types
  return null;
}
