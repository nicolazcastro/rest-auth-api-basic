import express from 'express'
import cors from 'cors';
import userRouter from './routes/users'
import { generateToken } from './utils/jwt.utils'
import { TokenPayload } from './types/types'
import { AccessTypes } from './models/enums'

const app = express()
app.use(express.json())

app.use(cors())

const PORT = 3000

if (process.env.NODE_ENV !== 'production') {
  const userTypes = Object.values(AccessTypes) as any[]
  const payload: TokenPayload = {
    name: 'John Doe',
    userId: 1,
    email: "john@doe.com",
    accessTypes: userTypes
  }
  console.log('JWT Token: ', generateToken(payload))
}

app.get('/ping', (_req, res) => {
  console.log('someone pinged here!!  ')
  res.send('pong')
})

app.use('/api/v1/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server is runing in port ${PORT}`)
})
