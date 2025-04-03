import { useEffect, useState } from "react";

export function useWsGetOrders() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [orderMessages, setOrderMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      setOrderMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.close();
    };
  }, []);

  const sendMessage = (message: object) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ WebSocket is not open. Message not sent.");
    }
  };

  // Hàm gửi request lấy orders
  const getOrders = (params: {
    token_address: string;
    limit?: number;
    offset?: number;
    trade_type?: "buy" | "sell";
    status?: "pending" | "executed" | "canceled" | "failed";
    order_type?: "market" | "limit";
  }) => {
    sendMessage({
      method: "getOrders",
      params,
    });
  };

  return { socket, orderMessages, sendMessage, getOrders };
}
