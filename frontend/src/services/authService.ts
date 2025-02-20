import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export interface ConfirmEmailResponse {
  status: string;
  token: string;
  user: any;
  message?: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface ResetPasswordResponse {
  status: string;
  token: string;
  user: any;
  message?: string;
}

export async function confirmEmail(token: string): Promise<ConfirmEmailResponse> {
  // The backend expects the query parameter "confirm-token"
  const response = await axios.get<ConfirmEmailResponse>(`${backendUrl}/api/v1/auth/confirm-email?confirm-token=${token}`);
  return response.data;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await axios.post<ForgotPasswordResponse>(`${backendUrl}/api/v1/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  // Send the token as "passwordResetToken" in the POST body
  const response = await axios.post<ResetPasswordResponse>(`${backendUrl}/api/v1/auth/reset-password`, { passwordResetToken: token, newPassword });
  return response.data;
}