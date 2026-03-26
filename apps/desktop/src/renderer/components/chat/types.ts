export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; summary: string }
  | { type: "tool_result"; toolUseId: string; content: string }
  | { type: "thinking" };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: ContentBlock[];
  createdAt: string;
}
