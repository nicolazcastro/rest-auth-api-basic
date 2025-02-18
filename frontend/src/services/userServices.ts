import axios from 'axios';
import { User } from '../types/userContextType';

// Base URL of the backend API
const baseURL = 'http://localhost:3000/api/v1/user';

export const getUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${baseURL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user information:', error);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/register`, { name, email, password, profile: 'user' });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

export const login = async (
  email: string,
  password: string,
  setUserData: (data: { user: User | null; token: string | null; isAuthenticated: boolean }) => void
): Promise<string> => {
  try {
    const response = await axios.post(`${baseURL}/login`, { email, password });
    const token = response.data.token; // Get the token from the response
    // Update the user context with the full object as expected
    setUserData({ user: response.data.user, token, isAuthenticated: true });
    return token;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
