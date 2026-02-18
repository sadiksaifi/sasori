import { useCallback, useState } from "react";
import { toast } from "sonner";
import { env } from "@sasori/env/web";
import { useWebSocket } from "@/hooks/use-web-socket";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WS_URL = env.VITE_SERVER_URL.replace(/^http/, "ws") + "/ws";

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleMessage = useCallback((data: string) => {
    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }

    switch (parsed.type) {
      case "text_delta":
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + parsed.text },
            ];
          }
          return [...prev, { role: "assistant", content: parsed.text }];
        });
        setIsStreaming(true);
        break;

      case "done":
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          // If deltas already built the assistant message, keep it
          if (last?.role === "assistant") return prev;
          // No deltas came through — use the final result
          if (parsed.result) {
            return [...prev, { role: "assistant", content: parsed.result }];
          }
          return prev;
        });
        setIsStreaming(false);
        break;

      case "error":
        toast.error(parsed.message || "Something went wrong");
        setIsStreaming(false);
        break;

      case "cancelled":
        setIsStreaming(false);
        break;
    }
  }, []);

  const { status, send } = useWebSocket({
    url: WS_URL,
    onMessage: handleMessage,
  });

  const handleSend = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsStreaming(true);
      send(JSON.stringify({ type: "prompt", text }));
    },
    [send],
  );

  // Show waiting indicator when streaming but no assistant message started yet
  const lastMsg = messages[messages.length - 1];
  const isWaiting = isStreaming && lastMsg?.role !== "assistant";

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {status === "disconnected" && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-destructive/10 text-destructive text-center text-sm py-1.5 backdrop-blur-sm">
          Disconnected — reconnecting...
        </div>
      )}
      <MessageList messages={messages} isWaiting={isWaiting} />
      <div className="input-top-gradient absolute bottom-[calc(theme(spacing.6)*2+3rem)] left-0 right-0 h-8 pointer-events-none z-10" />
      <ChatInput onSend={handleSend} disabled={status !== "connected"} />
    </div>
  );
}
