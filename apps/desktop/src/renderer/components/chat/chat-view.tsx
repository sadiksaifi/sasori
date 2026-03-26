import { useCallback, useState } from "react";
import { PaperPlaneTiltIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";
import type { Project, Session } from "@/stores/project-store";
import { useToolbar } from "@/hooks/use-toolbar";
import type { Message } from "./types";
import { mockMessages } from "./mock-data";
import { EmptyState } from "./empty-state";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

interface ChatViewProps {
  project: Project;
  session: Session;
}

export function ChatView({ project, session }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useToolbar({
    title: session.title,
    actions: [
      { key: "push", label: "Push", icon: PaperPlaneTiltIcon },
      { key: "open", label: "Open", icon: ArrowSquareOutIcon },
    ],
  });

  const handleSend = useCallback((text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: [{ type: "text", text }],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex-1 overflow-hidden">
      {hasMessages ? (
        <MessageList messages={messages} />
      ) : (
        <EmptyState projectName={project.name} />
      )}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
