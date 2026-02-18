import { createContext, useContext, type ReactNode } from "react";
import { useChats, type Chat } from "@/hooks/use-chats";

interface ChatsContextValue {
  chats: Chat[];
  isLoading: boolean;
  createChat: () => Promise<Chat>;
  deleteChat: (id: string) => Promise<void>;
  updateChatTitle: (id: string, title: string) => void;
  streamingChatIds: string[];
  addStreamingChat: (chatId: string) => void;
  removeStreamingChat: (chatId: string) => void;
}

const ChatsContext = createContext<ChatsContextValue | null>(null);

export function ChatsProvider({ children }: { children: ReactNode }) {
  const value = useChats();
  return (
    <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>
  );
}

export function useChatsContext() {
  const ctx = useContext(ChatsContext);
  if (!ctx) {
    throw new Error("useChatsContext must be used within ChatsProvider");
  }
  return ctx;
}
