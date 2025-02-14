
import * as userServices from '../services/users/usersServices'
import { Request, Response } from 'express'
import toNewUserEntry from '../services/users/userUtils'
import { decodeToken } from '../utils/jwt.utils'

export function getUsers(_req: Request, res: Response): void {
  userServices.getUsers().then((users) => {
    console.log('Result from service: ')
    console.log(users)
    return (users != null) ? res.send(users) : res.sendStatus(404)
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    userServices.findByEmail(req.body.email).then(async (user) => {
      if (user !== null) {
        return res.status(409).send('Email Already in use')
      } else {
        return await toNewUserEntry(req.body).then((parsedUserEntry) => {
          userServices.register(parsedUserEntry).then((user) => {
            console.log('Result from added new entry: ')
            console.log(user)
            console.log('New User to register')
            console.log(parsedUserEntry)
            return (user != null) ? res.send(user) : res.sendStatus(201)
          }).catch((e: any) => {
            console.log(e)
            throw new Error(e)
          })
        }).catch((e: any) => {
          console.log(e)
          throw new Error(e)
        })
      }
    }).catch((e: any) => {
      console.log(e)
      throw new Error(e)
    })
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    if (req.body.email !== undefined && req.body.password !== undefined) {
      userServices.login(req.body.email, req.body.password).then((token) => {
        let user = {}
        if (token) {
          const decodedToken = decodeToken(token)
          user = { name: decodedToken.name, email: decodedToken.email, id: decodedToken.id }
        }
        return (token != null) ? res.send({ token, user }) : res.sendStatus(401)
      }).catch((e: any) => {
        console.log(e)
        throw new Error(e)
      })
    } else {
      res.status(401).send({ error: 'Invalid Credentials' })
    }
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    let token: string = req.headers.authorization as string
    if (token.toLowerCase().startsWith('bearer')) {
      token = token.slice('bearer'.length).trim()
    }

    const decodedToken = decodeToken(token)
    if (typeof decodedToken.userId === 'number') {
      userServices.findMeByUserId(decodedToken.userId).then((user) => {
        return (user != null) ? res.send(user) : res.sendStatus(201)
      }).catch((e: any) => {
        console.log(e)
        throw new Error(e)
      })
    } else {
      res.status(500).send()
    }
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}
