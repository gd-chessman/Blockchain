import { create } from 'zustand';

const useAuthStore = create((set: any) => {
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return {
    token: savedToken,
    isAuthenticated: !!savedToken,
    login: (token: string) => {
      localStorage.setItem('auth_token', token);
      set({ token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('auth_token');
      set({ token: null, isAuthenticated: false });
    },
  };
});

export const useAuth = () => {
  const { token, isAuthenticated, login, logout } = useAuthStore();
  
  return { token, isAuthenticated, login, logout };
};