'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import socket from '@/configs/socket';

export default function Page() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    socket.on('ws', (data) => {
      console.log(data)
    });

    return () => {
      socket.off('ws');
    };
  }, []);

  return (
    <div>
      <h2>Trang chủ của tôi</h2>
    </div>
  );
}
