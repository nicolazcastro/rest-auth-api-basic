import { sign, verify, decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types/authTypes';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1d';

const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Decodes a JWT token without verifying its signature.
 */
export function decodeToken(token: string): any {
  return decode(token);
}

/**
 * Generates an access token using JWT_SECRET and the expiration time.
 */
export function generateToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN });
}

/**
 * Validates an access token and returns the decoded payload.
 */
export async function validateToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, { algorithms: ['HS256'], maxAge: JWT_EXPIRES_IN }, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded as TokenPayload);
    });
  });
}

/**
 * Generates a refresh token using a different secret and expiration time.
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

/**
 * Validates a refresh token and returns the decoded payload.
 */
export async function validateRefreshToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as TokenPayload);
    });
  });
}
