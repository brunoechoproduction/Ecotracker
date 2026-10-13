import React, { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User } from '../types/auth';
import { setAccessToken, clearTokens } from '../services/api/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const accessToken = await SecureStore.getItemAsync('access_token');
      const userStr = await SecureStore.getItemAsync('user');
      
      if (refreshToken && userStr) {
        if (accessToken) {
          setAccessToken(accessToken);
        }
        setUser(JSON.parse(userStr));
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Error checking token', e);
    } finally {
      setIsAppLoading(false);
    }
  };

  const setAuth = async (userData: User, accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuth = async () => {
    await clearTokens();
    await SecureStore.deleteItemAsync('user');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/(auth)/login');
  };

  const updateUser = async (userData: User) => {
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: isAppLoading,
        setAuth,
        clearAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
