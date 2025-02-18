import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/userContextType';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
  setUserData: (userData: { user: User | null; token: string | null; isAuthenticated: boolean }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // When token changes, update isAuthenticated and fetch user data if token exists.
  useEffect(() => {
    setIsAuthenticated(!!token);
    if (token) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      axios
        .get(`${backendUrl}/api/v1/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
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
          // If fetching fails (e.g., token is invalid), remove the token.
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const setUserData = ({
    user,
    token,
    isAuthenticated,
  }: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }) => {
    setUser(user);
    setToken(token);
    setIsAuthenticated(isAuthenticated);
    localStorage.setItem('token', token || '');
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, token, logout: handleLogout, setUserData }}>
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