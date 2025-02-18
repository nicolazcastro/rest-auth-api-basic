import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types/userContextType';

// Define the context type
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
  setUserData: (userData: { user: User | null; token: string | null; isAuthenticated: boolean }) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Update isAuthenticated whenever token changes
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // Updated setUserData to accept three properties in an object
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
    // You can optionally update isAuthenticated directly here:
    // setIsAuthenticated(isAuthenticated);
    localStorage.setItem('token', token || '');
  };

  return (
    <UserContext.Provider value={{ user, setUserData, isAuthenticated, token, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the user context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
