import apiClient from './apiClient';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export interface ConfirmEmailResponse {
  status: string;
  tokens: { accessToken: string; refreshToken: string };
  user: any;
  message?: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface ResetPasswordResponse {
  status: string;
  tokens: { accessToken: string; refreshToken: string };
  user: any;
  message?: string;
}

/**
 * Sends a GET request to confirm the user's email.
 */
export async function confirmEmail(token: string): Promise<ConfirmEmailResponse> {
  // The backend expects the query parameter "confirm-token"
  const response = await apiClient.get<ConfirmEmailResponse>(
    `${backendUrl}/api/v1/auth/confirm-email?confirm-token=${token}`
  );
  return response.data;
}

/**
 * Sends a POST request for forgot password.
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await apiClient.post<ForgotPasswordResponse>(
    `${backendUrl}/api/v1/auth/forgot-password`,
    { email }
  );
  return response.data;
}

/**
 * Sends a POST request to reset the password.
 */
export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  // Send the token as "passwordResetToken" in the POST body
  const response = await apiClient.post<ResetPasswordResponse>(
    `${backendUrl}/api/v1/auth/reset-password`,
    { passwordResetToken: token, newPassword }
  );
  return response.data;
}
