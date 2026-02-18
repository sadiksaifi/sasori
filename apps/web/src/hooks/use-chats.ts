import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Chat {
  id: string;
  title: string | null;
  createdAt: number;
  updatedAt: number;
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api<Chat[]>("/api/chats")
      .then(setChats)
      .finally(() => setIsLoading(false));
  }, []);

  const createChat = useCallback(async () => {
    const chat = await api<Chat>("/api/chats", { method: "POST" });
    setChats((prev) => [chat, ...prev]);
    return chat;
  }, []);

  const deleteChat = useCallback(async (id: string) => {
    await api(`/api/chats/${id}`, { method: "DELETE" });
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateChatTitle = useCallback((id: string, title: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  return { chats, isLoading, createChat, deleteChat, updateChatTitle };
}
