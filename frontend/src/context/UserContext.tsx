import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Our Axios client that handles token refresh automatically.
import { User } from '../types/userContextType';
import { getStoredTokens, clearStoredTokens } from '../utils/tokenStorage';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
  setUserData: (data: { 
    user: User | null; 
    accessToken: string | null; 
    refreshToken: string | null; 
    isAuthenticated: boolean 
  }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Retrieve stored tokens from localStorage using tokenStorage.ts
  const storedTokens = getStoredTokens();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(storedTokens.accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(storedTokens.refreshToken);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storedTokens.accessToken);

  // When the access token changes, update authentication status and fetch user info.
  useEffect(() => {
    setIsAuthenticated(!!accessToken);
    if (accessToken) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      apiClient
        .get(`${backendUrl}/api/v1/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          if (response.data.status === 'success') {
            setUser(response.data.user);
          } else {
            setUser(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          // If fetching fails (e.g., token invalid), clear stored tokens and reset state.
          clearStoredTokens();
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [accessToken]);

  // Logout function: clears both tokens and resets user state.
  const logout = () => {
    clearStoredTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  // setUserData updates context state and stores tokens in localStorage.
  const setUserData = ({
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
  }: {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
  }) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(isAuthenticated);
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, accessToken, refreshToken, logout, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
