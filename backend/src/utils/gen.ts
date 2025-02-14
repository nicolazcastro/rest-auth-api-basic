import { generateKeyPairSync } from 'crypto'
import { join } from 'path'
import { writeFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()
const passphrase: string = process.env.TOKEN_PASSPFRASE as string

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase
  }
})

const privateKeyFile = './../keys/.private.key'
const publicKeyFile = './../keys/.public.key.pem'

writeFileSync(join(__dirname, privateKeyFile), privateKey)
writeFileSync(join(__dirname, publicKeyFile), publicKey)
