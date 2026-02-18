import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "@/components/chat/chat-container";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <ChatContainer />;
}
