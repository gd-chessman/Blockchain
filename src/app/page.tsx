'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import socket from '@/configs/socket';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Page() {
  const { messages } = useWebSocket();

  return (
    <div>
      <h2>Trang chủ của tôi</h2>
      <ul className="list-disc ml-4 mt-2">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
