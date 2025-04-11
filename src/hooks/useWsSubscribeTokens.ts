import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from 'socket.io-client';

interface Token {
  id: number;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoUrl: string;
  coingeckoId: string | null;
  tradingviewSymbol: string | null;
  isVerified: boolean;
  marketCap: number;
}

interface SubscribeParams {
  page?: number;
  limit?: number;
  verified?: boolean;
  random?: boolean;
}

export function useWsSubscribeTokens(params?: SubscribeParams) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(true);
  const pathname = usePathname();
  const isTradingPage = pathname?.startsWith('/trading');
  const isDashboardPage = pathname?.startsWith('/dashboard');

  const convertToken = (token: any): Token => {
    return {
      id: token.slt_id,
      name: token.slt_name || token.name,
      symbol: token.slt_symbol || token.symbol,
      address: token.slt_address || token.address,
      decimals: token.slt_decimals || token.decimals,
      logoUrl: token.slt_logo_url || token.logoUrl,
      coingeckoId: null,
      tradingviewSymbol: null,
      isVerified: token.slt_is_verified || token.isVerified,
      marketCap: 0,
    };
  };

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
            const rawTokens = data.data?.tokens || [];
            const convertedTokens = rawTokens
              .slice(-24) // Keep only the latest 24 tokens
              .map(convertToken);
            setTokens(convertedTokens);
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

  return { socket, tokens, sendMessage, error, isConnected };
}