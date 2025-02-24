import apiClient from './apiClient';
import { storeTokens } from '../utils/tokenStorage';
import { User } from '../types/userContextType';

// Use the environment variable for the backend URL
const baseURL = import.meta.env.VITE_BACKEND_URL + '/api/v1/user';

/**
 * Function to refresh the token.
 * Sends the current refresh token to the backend and returns the new tokens.
 * @param refreshToken - The current refresh token.
 * @returns An object containing the new accessToken and refreshToken.
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await apiClient.post(`${baseURL}/refresh-token`, { refreshToken });
  // Assume the backend returns { status: "success", tokens: { accessToken, refreshToken } }
  return response.data.tokens;
}

/**
 * Registers a new user.
 * @param name - User's name.
 * @param email - User's email.
 * @param password - User's password.
 * @returns The response data from the backend.
 */
export const registerUser = async (name: string, email: string, password: string) => {
  const response = await apiClient.post(`${baseURL}/register`, { name, email, password, profile: 'user' });
  return response.data;
};

/**
 * Adjusted login function to handle both tokens.
 * Sends login credentials to the backend, saves both tokens, and updates the user context.
 * @param email - User's email.
 * @param password - User's password.
 * @param setUserData - Callback to update the UserContext.
 * @returns The new access token.
 */
export const login = async (
  email: string,
  password: string,
  setUserData: (data: {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
  }) => void
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await apiClient.post(`${baseURL}/login`, { email, password });
  // Assume the backend returns: 
  // { status: "success", tokens: { accessToken, refreshToken }, user: {...} }
  const { accessToken, refreshToken } = response.data.tokens;
  const user = response.data.user;
  
  // Save both tokens in storage (handled inside the service, if applicable)
  storeTokens(accessToken, refreshToken);
  
  // Update the context with the new structure
  setUserData({ user, accessToken, refreshToken, isAuthenticated: true });
  
  return { accessToken, refreshToken };
};

/**
 * Retrieves user information from the backend using the access token.
 * @param token - The current access token.
 * @returns The user information.
 */
export const getUserInfo = async (token: string) => {
  const response = await apiClient.get(`${baseURL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
