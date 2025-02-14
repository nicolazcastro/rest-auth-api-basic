import { sign, SignOptions, verify, VerifyOptions, decode } from 'jsonwebtoken'
import * as fs from 'fs'
import dotenv from 'dotenv'
import * as path from 'path'
import { TokenPayload } from '../types/types'

dotenv.config()

const passphrase: string = process.env.TOKEN_PASSPFRASE as string
const kid: string = process.env.KEY_ID as string
const issuer: string = process.env.KEY_ISSUER as string

const privateKeyFile = './../keys/.private.key'
const publicKeyFile = './../keys/.public.key.pem'

const privateKey = fs.readFileSync(path.join(__dirname, privateKeyFile), 'utf8')

const publicKey = fs.readFileSync(path.join(__dirname, publicKeyFile), 'utf8')

const signInOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '365 day',
  issuer,
  keyid: kid
}

export function decodeToken (token: string): any {
  return decode(token)
}

export function generateToken (payload: any): string {
  return sign(payload, {
    key: privateKey,
    passphrase
  }, signInOptions)
}

export async function validateToken (token: string): Promise<TokenPayload> {
  const verifyOptions: VerifyOptions = {
    issuer,
    algorithms: ['RS256'],
    maxAge: '1 day'
  }

  return await new Promise((resolve, reject) => {
    verify(token, publicKey, verifyOptions, (error: any, decoded: any) => {
      console.log(error)
      if (error != null) return reject(error)
      resolve(decoded)
    })
  })
}
