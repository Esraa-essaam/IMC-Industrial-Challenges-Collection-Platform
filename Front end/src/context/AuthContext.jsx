/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('imc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('imc_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imc_token');
    localStorage.removeItem('imc_user');
    authAPI.logout().catch(() => {});
  }, []);

  // Validate token on initial mount
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setInitLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe(token);
        if (res.success && res.factory) {
          setUser(res.factory);
          localStorage.setItem('imc_user', JSON.stringify(res.factory));
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        // If token is invalid or expired, clear storage
        logout();
      } finally {
        setInitLoading(false);
      }
    }

    verifySession();
  }, [token, logout]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authAPI.login(credentials);
      if (res.token && res.factory) {
        setToken(res.token);
        setUser(res.factory);
        localStorage.setItem('imc_token', res.token);
        localStorage.setItem('imc_user', JSON.stringify(res.factory));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (factoryData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(factoryData);
      if (res.token && res.factory && !res.requiresApproval) {
        setToken(res.token);
        setUser(res.factory);
        localStorage.setItem('imc_token', res.token);
        localStorage.setItem('imc_user', JSON.stringify(res.factory));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    initLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
