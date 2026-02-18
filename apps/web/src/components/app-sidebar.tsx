import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, MessageSquarePlus, Trash2 } from "lucide-react";
import { useChatsContext } from "@/contexts/chats-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { chats, createChat, deleteChat, streamingChatIds } =
    useChatsContext();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { chatId?: string };
  const activeChatId = params.chatId;

  const handleNewChat = async () => {
    const chat = await createChat();
    navigate({ to: "/chat/$chatId", params: { chatId: chat.id } });
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteChat(id);
    if (activeChatId === id) {
      navigate({ to: "/" });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Session
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === activeChatId}
                    onClick={() =>
                      navigate({
                        to: "/chat/$chatId",
                        params: { chatId: chat.id },
                      })
                    }
                    className="group/item"
                  >
                    <span className="truncate flex-1">
                      {chat.title || "New chat"}
                    </span>
                    {streamingChatIds.includes(chat.id) && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover/item:opacity-100 hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
