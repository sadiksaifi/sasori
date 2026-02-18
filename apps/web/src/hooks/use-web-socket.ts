import { useCallback, useEffect, useRef, useState } from "react";

type Status = "connecting" | "connected" | "disconnected";

export function useWebSocket(options: {
  url: string;
  onMessage: (data: string) => void;
  reconnectDelay?: number;
}): {
  status: Status;
  send: (message: string) => void;
} {
  const { url, reconnectDelay = 2000 } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(options.onMessage);
  const [status, setStatus] = useState<Status>("connecting");

  // Keep callback ref fresh without triggering reconnects
  onMessageRef.current = options.onMessage;

  useEffect(() => {
    let unmounted = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      if (unmounted) return;
      setStatus("connecting");

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!unmounted) setStatus("connected");
      };

      ws.onmessage = (e) => {
        onMessageRef.current(e.data);
      };

      ws.onclose = () => {
        if (unmounted) return;
        setStatus("disconnected");
        reconnectTimer = setTimeout(connect, reconnectDelay);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      unmounted = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [url, reconnectDelay]);

  const send = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  return { status, send };
}
