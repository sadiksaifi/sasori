import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "@/components/chat/chat-container";

export const Route = createFileRoute("/chat/$chatId")({
  component: ChatRoute,
});

function ChatRoute() {
  const { chatId } = Route.useParams();
  return <ChatContainer chatId={chatId} />;
}
