/**
 * AUTH_INTERCEPTOR_EXCLUSIONS defines the endpoints for which the refresh token
 * logic should be skipped by the Axios interceptor. These are typically endpoints
 * like login, register, or any other authentication-related endpoints where a 401
 * should be handled normally without attempting to refresh the token.
 */
export const AUTH_INTERCEPTOR_EXCLUSIONS: string[] = [
    '/login',
    '/register',
    // Add other endpoints here if necessary.
  ];