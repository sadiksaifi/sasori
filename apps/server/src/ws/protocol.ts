export type ClientMessage =
  | { type: "prompt"; text: string }
  | { type: "cancel" };

export type ServerMessage =
  | { type: "text_delta"; text: string }
  | { type: "tool_use"; tool: string; input: string }
  | { type: "tool_result"; tool: string; output: string }
  | { type: "done"; result: string }
  | { type: "error"; message: string }
  | { type: "cancelled" }
  | {
      type: "history";
      messages: Array<{
        id: string;
        role: string;
        content: string;
        createdAt: number;
      }>;
    };
