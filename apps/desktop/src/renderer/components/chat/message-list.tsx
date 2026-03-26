import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "@phosphor-icons/react";
import type { Message } from "./types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const toolResults = new Map<string, string>();
  for (const msg of messages) {
    for (const block of msg.content) {
      if (block.type === "tool_result") {
        toolResults.set(block.toolUseId, block.content);
      }
    }
  }

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-window pb-28"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-group xl:max-w-4xl 2xl:max-w-5xl">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} toolResults={toolResults} />
          ))}
        </div>
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 flex h-control-lg w-control-lg -translate-x-1/2 items-center justify-center rounded-full border border-opaque-separator bg-grouped-background/80 text-secondary-label backdrop-blur-xl transition-opacity active:opacity-70"
        >
          <ArrowDownIcon size={12} />
        </button>
      )}
    </div>
  );
}
