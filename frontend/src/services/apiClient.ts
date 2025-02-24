import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken as refreshTokenService } from './userServices';
import { getStoredTokens, storeTokens, clearStoredTokens } from '../utils/tokenStorage';
import { AUTH_INTERCEPTOR_EXCLUSIONS } from '../config/authInterceptorExclusions';

// Create an Axios instance with the backend base URL.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
});

// Request interceptor to inject the access token into every request.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getStoredTokens();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and attempt token refresh.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // If no URL is available, reject immediately.
    if (!originalRequest.url) {
      return Promise.reject(error);
    }
    
    // Now assert that originalRequest.url is not undefined.
    const requestUrl: string = originalRequest.url!;

    // Check if the request URL should be excluded from token refresh logic.
    if (AUTH_INTERCEPTOR_EXCLUSIONS.some((route) => requestUrl.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        const { refreshToken } = getStoredTokens();
        if (!refreshToken) {
          throw new Error('No refresh token stored');
        }
        const { accessToken: newAccess, refreshToken: newRefresh } = await refreshTokenService(refreshToken);
        storeTokens(newAccess, newRefresh);
        if (originalRequest.headers) {
          originalRequest.headers.set('Authorization', `Bearer ${newAccess}`);
        }
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        clearStoredTokens();
        window.location.href = '/'; // Redirect to login page as needed.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;