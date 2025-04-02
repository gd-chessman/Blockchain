'use client'
import { useAuth } from '@/hooks/useAuth';


export default function page() {
  const { isAuthenticated, logout } = useAuth();
  console.log(isAuthenticated)
  return (
    <div>
      <h2>Trang chủ</h2>
    </div>
  )
}
