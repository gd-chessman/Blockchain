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
  liquidity: any;
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
  const tokenStackRef = useRef<Token[]>([]); // Stack chứa tối đa 100 token
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const MAX_STACK_SIZE = 100; // Giới hạn stack 100 token
  const DISPLAY_INTERVAL = 500; // Hiển thị mỗi s
  const TOKENS_PER_UPDATE = 1; // Số token cập nhật mỗi lần

  const convertToken = (token: any): Token => {
    return {
      id: token.slt_id,
      name: token.slt_name || token.name,
      symbol: token.slt_symbol || token.symbol,
      address: token.slt_address || token.address,
      decimals: token.slt_decimals || token.decimals,
      logoUrl: token.slt_logo_url || token.logoUrl,
      liquidity: token.slt_initial_liquidity || token.liquidity,
      coingeckoId: null,
      tradingviewSymbol: null,
      isVerified: token.slt_is_verified || token.isVerified,
      marketCap: token.slt_market_cap || token.marketCap,
    };
  };

  const updateTokens = () => {
    if (!mountedRef.current || tokenStackRef.current.length === 0) return;

    // Lấy 2 token mới nhất từ stack và xóa chúng khỏi stack
    const newTokens = tokenStackRef.current.slice(0, TOKENS_PER_UPDATE);
    tokenStackRef.current = tokenStackRef.current.slice(TOKENS_PER_UPDATE);
    
    if (newTokens.length > 0) {
      setTokens(prevTokens => {
        // Thêm các token mới vào đầu mảng và giới hạn số lượng theo params.limit
        return [...newTokens, ...prevTokens].slice(0, params?.limit || 24);
      });
      
    }
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
        // Reset stack khi kết nối lại
        tokenStackRef.current = [];
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
            const convertedTokens = rawTokens.map(convertToken);

            if (isInitialLoadRef.current) {
              // Lần đầu kết nối: 
              // 1. Hiển thị theo limit
              setTokens(convertedTokens.slice(0, params?.limit || 24));
              // 2. Lưu phần còn lại vào stack (nếu có)
              tokenStackRef.current = convertedTokens.slice(params?.limit || 24);
              isInitialLoadRef.current = false;
              console.log('Initial load:', convertedTokens.length, 'tokens');
            } else {
              // Các lần cập nhật sau:
              // Tạo Set chứa các address đã có trong stack
              const existingAddresses = new Set(tokenStackRef.current.map(token => token.address));
              
              // Lọc ra các token mới có address chưa tồn tại trong stack
              const uniqueNewTokens = convertedTokens.filter((token: Token) => !existingAddresses.has(token.address));
              
              // Thêm tokens mới vào cuối và giữ tối đa MAX_STACK_SIZE
              tokenStackRef.current = [...tokenStackRef.current, ...uniqueNewTokens]
                .slice(-MAX_STACK_SIZE);
            
            }
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
      isInitialLoadRef.current = true;
      tokenStackRef.current = []; // Reset stack
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
    
    // Cập nhật tokens mỗi 0.5s
    updateIntervalRef.current = setInterval(updateTokens, DISPLAY_INTERVAL);
    
    return () => {
      mountedRef.current = false;
      if (socket) {
        socket.emit('unSubscribeTokens');
        socket.disconnect();
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
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