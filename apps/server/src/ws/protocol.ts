export type ClientMessage =
  | { type: "prompt"; text: string }
  | { type: "cancel" };

export type ServerMessage =
  | { type: "text_delta"; text: string }
  | { type: "tool_use"; tool: string; input: string }
  | { type: "tool_result"; tool: string; output: string }
  | { type: "done"; result: string }
  | { type: "error"; message: string }
  | { type: "cancelled" };
