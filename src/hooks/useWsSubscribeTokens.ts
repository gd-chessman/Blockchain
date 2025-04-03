import { useEffect, useState } from "react";

export function useWsSubscribeTokens() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [tokenMessages, setTokenMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      ws.send(JSON.stringify({ method: "subscribeTokens" })); // Gửi message khi kết nối
    };

    ws.onmessage = (event) => {
      setTokenMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {

    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: object) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, tokenMessages, sendMessage };
}