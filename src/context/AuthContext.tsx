import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  isAuthenticated as checkAuth,
  login as authLogin,
  logout as authLogout,
  refreshSession,
} from '@/data/storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  refreshAuth: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());

  const login = useCallback((password: string): boolean => {
    const success = authLogin(password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setIsAuthenticated(false);
    window.location.reload();
  }, []);

  const refreshAuth = useCallback(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
