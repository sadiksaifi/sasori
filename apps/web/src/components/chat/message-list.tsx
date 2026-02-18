import { useCallback, useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isWaiting: boolean;
}

export function MessageList({ messages, isWaiting }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      sentinelRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isWaiting]);

  const isEmpty = messages.length === 0 && !isWaiting;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto scroll-fade-mask"
    >
      {isEmpty ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-lg">
            What can I help you with?
          </p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-4 pb-8">
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isWaiting && <TypingIndicator />}
          <div ref={sentinelRef} />
        </div>
      )}
    </div>
  );
}
