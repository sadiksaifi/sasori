import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { env } from "@sasori/env/web";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useChatsContext } from "@/contexts/chats-context";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WS_BASE = env.VITE_SERVER_URL.replace(/^http/, "ws");

export function ChatContainer({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { updateChatTitle, addStreamingChat, removeStreamingChat } =
    useChatsContext();
  const isFirstMessageRef = useRef(true);
  const hasNotifiedStreamingRef = useRef(false);

  // Typewriter reveal refs
  const serverTextRef = useRef("");
  const revealedIndexRef = useRef(0);
  const serverDoneRef = useRef(false);
  const revealTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Use refs to avoid adding dependencies to handleMessage
  const addStreamingChatRef = useRef(addStreamingChat);
  const removeStreamingChatRef = useRef(removeStreamingChat);
  const chatIdRef = useRef(chatId);
  useEffect(() => {
    addStreamingChatRef.current = addStreamingChat;
    removeStreamingChatRef.current = removeStreamingChat;
    chatIdRef.current = chatId;
  }, [addStreamingChat, removeStreamingChat, chatId]);

  // Start the reveal interval if not already running
  function startReveal() {
    if (revealTimerRef.current) return;
    revealTimerRef.current = setInterval(() => {
      const target = serverTextRef.current;
      const revealed = revealedIndexRef.current;

      if (revealed >= target.length) {
        if (serverDoneRef.current) {
          clearInterval(revealTimerRef.current);
          revealTimerRef.current = undefined;
          setIsStreaming(false);
          hasNotifiedStreamingRef.current = false;
          removeStreamingChatRef.current(chatIdRef.current);
          serverTextRef.current = "";
          revealedIndexRef.current = 0;
          serverDoneRef.current = false;
        }
        return;
      }

      const remaining = target.length - revealed;
      const chars = Math.max(2, Math.ceil(remaining / 60));
      revealedIndexRef.current = Math.min(revealed + chars, target.length);
      const text = target.slice(0, revealedIndexRef.current);

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { ...last, content: text }];
        }
        return [...prev, { role: "assistant", content: text }];
      });
    }, 16);
  }

  // Stop the reveal interval, optionally flushing remaining text
  function stopReveal(flush: boolean) {
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = undefined;
    }
    if (flush && revealedIndexRef.current < serverTextRef.current.length) {
      const text = serverTextRef.current;
      revealedIndexRef.current = text.length;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { ...last, content: text }];
        }
        return [...prev, { role: "assistant", content: text }];
      });
    }
    serverTextRef.current = "";
    revealedIndexRef.current = 0;
    serverDoneRef.current = false;
  }

  // Refs so handleMessage (with [] deps) can access latest helpers
  const startRevealRef = useRef(startReveal);
  const stopRevealRef = useRef(stopReveal);
  useEffect(() => {
    startRevealRef.current = startReveal;
    stopRevealRef.current = stopReveal;
  });

  // Reset state when chatId changes
  useEffect(() => {
    setMessages([]);
    setIsStreaming(false);
    setIsLoadingHistory(true);
    isFirstMessageRef.current = true;
    hasNotifiedStreamingRef.current = false;
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = undefined;
    }
    serverTextRef.current = "";
    revealedIndexRef.current = 0;
    serverDoneRef.current = false;
  }, [chatId]);

  const handleMessage = useCallback((data: string) => {
    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }

    switch (parsed.type) {
      case "history":
        setMessages(
          parsed.messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        );
        isFirstMessageRef.current = parsed.messages.length === 0;
        setIsLoadingHistory(false);
        break;

      case "stream_resume":
        serverTextRef.current += parsed.accumulatedText;
        startRevealRef.current();
        setIsStreaming(true);
        if (!hasNotifiedStreamingRef.current) {
          hasNotifiedStreamingRef.current = true;
          addStreamingChatRef.current(chatIdRef.current);
        }
        break;

      case "stream_active":
        setIsStreaming(true);
        if (!hasNotifiedStreamingRef.current) {
          hasNotifiedStreamingRef.current = true;
          addStreamingChatRef.current(chatIdRef.current);
        }
        break;

      case "text_delta":
        serverTextRef.current += parsed.text;
        startRevealRef.current();
        setIsStreaming(true);
        if (!hasNotifiedStreamingRef.current) {
          hasNotifiedStreamingRef.current = true;
          addStreamingChatRef.current(chatIdRef.current);
        }
        break;

      case "done":
        if (serverTextRef.current.length === 0 && parsed.result) {
          serverTextRef.current = parsed.result;
          startRevealRef.current();
        }
        serverDoneRef.current = true;
        break;

      case "error":
        stopRevealRef.current(true);
        toast.error(parsed.message || "Something went wrong");
        setIsStreaming(false);
        hasNotifiedStreamingRef.current = false;
        removeStreamingChatRef.current(chatIdRef.current);
        break;

      case "cancelled":
        stopRevealRef.current(true);
        setIsStreaming(false);
        hasNotifiedStreamingRef.current = false;
        removeStreamingChatRef.current(chatIdRef.current);
        break;
    }
  }, []);

  const wsUrl = `${WS_BASE}/ws?chatId=${chatId}`;
  const { status, send } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
  });

  const handleSend = useCallback(
    (text: string) => {
      // Update title from first user message
      if (isFirstMessageRef.current) {
        isFirstMessageRef.current = false;
        updateChatTitle(chatId, text.slice(0, 50));
      }

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsStreaming(true);
      hasNotifiedStreamingRef.current = true;
      addStreamingChatRef.current(chatId);
      send(JSON.stringify({ type: "prompt", text }));
    },
    [send, chatId, updateChatTitle],
  );

  const lastMsg = messages[messages.length - 1];
  const isWaiting = isStreaming && lastMsg?.role !== "assistant";

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {status === "disconnected" && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-destructive/10 text-destructive text-center text-sm py-1.5 backdrop-blur-sm">
          Disconnected — reconnecting...
        </div>
      )}
      <MessageList
        messages={messages}
        isWaiting={isWaiting}
        isLoadingHistory={isLoadingHistory}
      />
      <div className="input-top-gradient absolute bottom-[calc(theme(spacing.6)*2+3rem)] left-0 right-0 h-8 pointer-events-none z-10" />
      <ChatInput onSend={handleSend} disabled={status !== "connected"} />
    </div>
  );
}
