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

    updateToken: (newToken: string) => {
      localStorage.removeItem('auth_token');
      localStorage.setItem('auth_token', newToken);
      set({ token: newToken });
    }
  };
});

export const useAuth = () => {
  const { token, isAuthenticated, login, logout, updateToken } = useAuthStore();
  
  return { token, isAuthenticated, login, logout, updateToken };
};
