import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChatsContext } from "@/contexts/chats-context";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { chats, isLoading, createChat } = useChatsContext();
  const navigate = useNavigate();

  const handleNewChat = async () => {
    const chat = await createChat();
    navigate({ to: "/chat/$chatId", params: { chatId: chat.id } });
  };

  if (isLoading) {
    return null;
  }

  // If there are existing chats, redirect to the most recent one
  if (chats.length > 0) {
    navigate({ to: "/chat/$chatId", params: { chatId: chats[0].id } });
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <p className="text-muted-foreground">No chats yet</p>
      <Button onClick={handleNewChat} className="gap-2">
        <MessageSquarePlus className="h-4 w-4" />
        New Session
      </Button>
    </div>
  );
}
