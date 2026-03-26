import type { Message } from "./types";
import { MarkdownContent } from "./markdown-content";
import { ToolBlock } from "./tool-block";

interface MessageBubbleProps {
  message: Message;
  toolResults: Map<string, string>;
}

export function MessageBubble({ message, toolResults }: MessageBubbleProps) {
  if (message.role === "user") {
    return <UserBubble message={message} />;
  }
  return <AssistantBubble message={message} toolResults={toolResults} />;
}

function UserBubble({ message }: { message: Message }) {
  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") return null;

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-lg bg-secondary-background px-3 py-2 text-body text-label">
        {text.text}
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  toolResults,
}: {
  message: Message;
  toolResults: Map<string, string>;
}) {
  return (
    <div className="text-body text-label">
      {message.content.map((block, i) => {
        const key = `${message.id}-${i}`;
        switch (block.type) {
          case "text":
            return (
              <div key={key}>
                <MarkdownContent content={block.text} />
              </div>
            );
          case "tool_use":
            return (
              <ToolBlock key={key} summary={block.summary} detail={toolResults.get(block.id)} />
            );
          case "tool_result":
            return null;
          case "thinking":
            return (
              <p key={key} className="my-1 text-callout italic text-tertiary-label">
                Thinking…
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
