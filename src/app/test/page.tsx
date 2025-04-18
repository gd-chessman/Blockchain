"use client";
import { useEffect, useRef, useState } from 'react';
import { io, Socket, Manager } from 'socket.io-client';
import { useWsTokenTransaction } from '@/hooks/useWsTokenTransaction';

interface PriceData {
  tokenAddress: string;
  price: number;
  timestamp: number;
}

interface SubscribedData {
  tokenAddress: string;
}

interface ErrorData {
  message: string;
}

export default function TestPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const socketRef = useRef<Socket | null>(null);
  const tokenAddress = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';

  // Use the transaction hook
  const { transaction, error: transactionError, isConnected: isTransactionConnected } = useWsTokenTransaction(tokenAddress);

  useEffect(() => {
    // Initialize Socket.IO connection
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const manager = new Manager(baseUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: false
    });

    // Connect to specific namespace
    socketRef.current = manager.socket('/token-info');

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnectionStatus('connected');
      // Subscribe to token when connected
      socketRef.current?.emit('subscribe', { tokenAddress });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnectionStatus('disconnected');
    });

    socketRef.current.on('price', (data: PriceData) => {
      console.log('Received price update:', data);
      setPrice(data.price);
      setLastUpdate(new Date(data.timestamp).toLocaleString());
    });

    socketRef.current.on('subscribed', (data: SubscribedData) => {
      console.log('Successfully subscribed to token:', data.tokenAddress);
    });

    socketRef.current.on('error', (error: ErrorData) => {
      console.error('WebSocket error:', error.message);
      setConnectionStatus('error');
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('unsubscribe', { tokenAddress });
        socketRef.current.disconnect();
      }
    };
  }, [tokenAddress]);

  return (
    <div className="p-5 text-black">
      <h1 className="text-2xl font-bold mb-4">Token Information</h1>
      
      {/* Price Information */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Price Information</h2>
        <div className="mb-2">
          <span className="font-semibold">Connection Status:</span> {connectionStatus}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Token Address:</span> {tokenAddress}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Current Price:</span> {price ? `$${price.toFixed(8)}` : 'Loading...'}
        </div>
        <div>
          <span className="font-semibold">Last Update:</span> {lastUpdate || 'No updates yet'}
        </div>
      </div>

      {/* Transaction Information */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Transaction Information</h2>
        <div className="mb-2">
          <span className="font-semibold">Connection Status:</span> {isTransactionConnected ? 'Connected' : 'Disconnected'}
        </div>
        {transactionError && (
          <div className="mb-2 text-red-500">
            <span className="font-semibold">Error:</span> {transactionError}
          </div>
        )}
        <div className="mb-2">
          <span className="font-semibold">Latest Transaction:</span>
          {transaction ? (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(transaction, null, 2)}
            </pre>
          ) : (
            <span className="ml-2">No transactions yet</span>
          )}
        </div>
      </div>
    </div>
  );
}