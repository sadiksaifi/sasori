import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

function renderContent(text: string) {
  // Split on triple backtick code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      // Code block: strip the backticks and optional language tag
      const inner = part.slice(3, -3);
      const newlineIdx = inner.indexOf("\n");
      const code = newlineIdx >= 0 ? inner.slice(newlineIdx + 1) : inner;
      return (
        <pre
          key={i}
          className="bg-card rounded-lg p-3 my-2 overflow-x-auto text-sm border border-border"
        >
          <code>{code}</code>
        </pre>
      );
    }

    // Handle inline code with single backticks
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((seg, j) => {
          if (seg.startsWith("`") && seg.endsWith("`")) {
            return (
              <code
                key={j}
                className="bg-card rounded px-1.5 py-0.5 text-sm border border-border"
              >
                {seg.slice(1, -1)}
              </code>
            );
          }
          return (
            <span key={j} className="whitespace-pre-wrap">
              {seg}
            </span>
          );
        })}
      </span>
    );
  });
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          isUser
            ? "bg-secondary text-secondary-foreground rounded-2xl px-4 py-2.5 max-w-[80%]"
            : "text-foreground pl-1 max-w-full leading-relaxed",
        )}
      >
        {renderContent(content)}
      </div>
    </div>
  );
}
