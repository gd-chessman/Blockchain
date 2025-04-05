'use client';

import React, { useEffect, useState } from 'react';

interface Order {
  // Define your order interface based on the expected response
  id: string;
  // Add other order properties as needed
}

export default function TestPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        setError('Authentication token not found');
        return;
      }

      const ws = new WebSocket('ws://localhost:8000/ws');

      ws.onopen = () => {
        console.log('WebSocket Connected');
        const message = {
          method: 'getAllOrders',
          params: {
            token_address: 'C8eKC6jjGou6Yn2aLnTC2fa4mfjmNmEUSoJgLXgYSHP8',
            status: 'executed',
            limit: 20,
            offset: 0
          }
        };
        console.log('Sending WebSocket message:', message);
        ws.send(JSON.stringify(message));
      };

      ws.onmessage = (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const response = JSON.parse(event.data);
          
          if (response.event === 'error') {
            console.error('WebSocket error response:', response);
            setError(response.data.message || 'Authentication error');
            return;
          }

          // Check if response has a data property that contains the orders
          if (response && Array.isArray(response)) {
            console.log('Received orders array:', response);
            setOrders(response);
          } else if (response && response.data && Array.isArray(response.data)) {
            console.log('Received orders from data property:', response.data);
            setOrders(response.data);
          } else {
            console.warn('Unexpected response format:', response);
            setError('Unexpected response format');
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          console.error('Raw message that caused error:', event.data);
          setError('Error parsing WebSocket message');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error details:', error);
        setError('WebSocket error occurred');
      };

      ws.onclose = (event) => {
        console.log('WebSocket Disconnected', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
      };

      return () => {
        ws.close();
      };
    };

    connectWebSocket();
  }, []);

  return (
    <div>
      <h1>Transaction Data</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        {orders.map((order) => (
          <div key={order.id}>
            {/* Render your order data here */}
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}



