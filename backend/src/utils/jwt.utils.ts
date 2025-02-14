import { sign, SignOptions, verify, VerifyOptions, decode } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenPayload } from '../types/types'

dotenv.config()

const secretKey: string = process.env.JWT_SECRET as string 

const signInOptions: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '365d'
}

export function decodeToken(token: string): any {
  return decode(token)
}

export function generateToken(payload: any): string {
  return sign(payload, secretKey, signInOptions) // Usa solo la clave secreta
}

export async function validateToken(token: string): Promise<TokenPayload> {
  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
    maxAge: '1d'
  }

  return await new Promise((resolve, reject) => {
    verify(token, secretKey, verifyOptions, (error: any, decoded: any) => {
      if (error) return reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}