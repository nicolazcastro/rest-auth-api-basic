// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types/userContextType';

// Define the context type
interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    logout: () => void;
    setUserData: (userData: { user: User | null, token: string | null, isAuthenticated: boolean }) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the context provider component
interface UserProviderProps {
    children: ReactNode; // Explicitly type children prop
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
    }, [isAuthenticated, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null); // Clear user data on logout
        setToken(null);
    };

    const setUserData = ({ user, token, isAuthenticated }: { user: User | null, token: string | null, isAuthenticated: boolean }) => {
        setUser(user);
        setToken(token);
        setIsAuthenticated(isAuthenticated);
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
        console.log('useUserContext must be used within a UserProvider');
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
