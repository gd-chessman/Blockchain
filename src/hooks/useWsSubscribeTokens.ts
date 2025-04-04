import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function useWsSubscribeTokens() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [tokenMessages, setTokenMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const pathname = usePathname();
  const isTradingPage = pathname?.startsWith('/trading');

  const connect = () => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);

      ws.onopen = () => {
        console.log("✅ Connected to WebSocket server - useWsSubscribeTokens");
        ws.send(JSON.stringify({ method: "subscribeTokens" }));
        setError(null);
      };

      ws.onmessage = (event) => {
        if (mountedRef.current) {
          try {
            const data = JSON.parse(event.data);
            console.log("Received WebSocket message:", data);
            setTokenMessages((prev) => [...prev, event.data]);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        }
      };

      ws.onclose = () => {
        console.log("❌ Disconnected from WebSocket server - useWsSubscribeTokens");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (mountedRef.current) {
          setError("WebSocket connection error");
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      if (mountedRef.current) {
        setError("Failed to create WebSocket connection");
      }
    }
  };

  const disconnect = () => {
    if (socket) {
      console.log("Disconnecting WebSocket...");
      // Gửi message unsubscribe trước khi đóng kết nối
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ method: "unsubscribeTokens" }));
      }
      socket.close();
      setSocket(null);
    }
  };

  // Effect to handle page navigation
  useEffect(() => {
    if (isTradingPage) {
      connect();
    } else {
      disconnect();
    }
  }, [isTradingPage]);

  // Effect to handle component mount/unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, []);

  const sendMessage = (message: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message - WebSocket is not open");
    }
  };

  return { socket, tokenMessages, sendMessage, error };
}