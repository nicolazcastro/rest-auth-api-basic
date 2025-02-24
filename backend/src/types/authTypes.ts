/**
 * authTypes.ts
 * 
 * This file centralizes the types used for authentication.
 */

/**
 * IAuthUser defines the properties required for token generation and authentication.
 * It is used as the payload for the JWT.
 */
export interface IAuthUser {
  name: string;
  email: string;
  userId: number;
  accessTypes: string[];
}

/**
 * TokenPayload is the data that will be signed in the JWT.
 * In our implementation, it is identical to IAuthUser.
 */
export type TokenPayload = IAuthUser;

/**
 * TokenResponse defines the structure returned by token-related services.
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}