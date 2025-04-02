'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Example API request
      axios.get('http://localhost:8000')
        .then(response => {
          console.log('API Response:', response.data);
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h2>Trang chủ của tôi</h2>
    </div>
  );
}
