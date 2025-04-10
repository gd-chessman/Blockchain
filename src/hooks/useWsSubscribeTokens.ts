import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from 'socket.io-client';

interface SubscribeParams {
  page?: number;
  limit?: number;
  verified?: boolean;
  random?: boolean;
}

export function useWsSubscribeTokens(params?: SubscribeParams) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tokenMessages, setTokenMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(true);
  const pathname = usePathname();
  const isTradingPage = pathname?.startsWith('/trading');
  const isDashboardPage = pathname?.startsWith('/dashboard');

  const connect = () => {
    if (!mountedRef.current) return;

    try {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000
      });

      newSocket.on('connect', () => {
        console.log("✅ Connected to Socket.IO server - useWsSubscribeTokens");
        setIsConnected(true);
        setError(null);
        newSocket.emit('subscribeTokens', params || {});
      });

      newSocket.on('disconnect', (reason) => {
        console.log("❌ Disconnected from Socket.IO server:", reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error("Socket.IO connection error:", error);
        if (mountedRef.current) {
          setError("Socket.IO connection error");
        }
      });

      newSocket.on('tokenUpdate', (data) => {
        if (mountedRef.current) {
          try {
            const tokens = data.data?.tokens || [];
            setTokenMessages([JSON.stringify({
              data: {
                tokens: tokens.slice(-24) // Keep only the latest 24 tokens
              }
            })]);
          } catch (error) {
            console.error("Error processing token data:", error);
          }
        }
      });

      newSocket.on('ping', () => {
        newSocket.emit('pong');
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Error creating Socket.IO connection:", error);
      if (mountedRef.current) {
        setError("Failed to create Socket.IO connection");
      }
    }
  };

  // Effect to handle page navigation
  useEffect(() => {
    if (isTradingPage || isDashboardPage) {
      connect();
    } else {
      if (socket) {
        socket.emit('unSubscribeTokens');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isTradingPage, isDashboardPage]);

  // Effect to handle component mount/unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (socket) {
        socket.emit('unSubscribeTokens');
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (message: object) => {
    if (socket && socket.connected) {
      socket.emit('message', message);
    } else {
      console.warn("Cannot send message - Socket.IO is not connected");
    }
  };

  return { socket, tokenMessages, sendMessage, error, isConnected };
}