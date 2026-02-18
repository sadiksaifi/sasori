import { useCallback, useEffect, useRef, useState } from "react";
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
  const [streamingChatIds, setStreamingChatIds] = useState<string[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    api<Chat[]>("/api/chats")
      .then(setChats)
      .finally(() => setIsLoading(false));

    // Fetch initial streaming status
    api<string[]>("/api/chats/streaming")
      .then(setStreamingChatIds)
      .catch(() => {});

    // Poll every 3 seconds for background updates
    pollingRef.current = setInterval(() => {
      api<string[]>("/api/chats/streaming")
        .then(setStreamingChatIds)
        .catch(() => {});
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, []);

  const addStreamingChat = useCallback((chatId: string) => {
    setStreamingChatIds((prev) =>
      prev.includes(chatId) ? prev : [...prev, chatId],
    );
  }, []);

  const removeStreamingChat = useCallback((chatId: string) => {
    setStreamingChatIds((prev) => prev.filter((id) => id !== chatId));
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

  return {
    chats,
    isLoading,
    createChat,
    deleteChat,
    updateChatTitle,
    streamingChatIds,
    addStreamingChat,
    removeStreamingChat,
  };
}
