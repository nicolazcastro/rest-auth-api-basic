import { IUser, INewUserEntry } from '../../models/user'
import bcrypt from 'bcrypt'
import { TokenPayload } from '../../types/types'
import { generateToken } from '../../utils/jwt.utils'
import { AccessTypes, AdminAccessTypes } from '../../models/enums'
import * as db from '../../db/db'

const User = db.getUserModel()

export async function getUsers(): Promise<IUser[] | any> {
  await db.connectDb()

  return User.find().then((entries: IUser[] | null) => {
    if (entries === null) {
      return entries
    } else {
      const objs: any[] = []

      for (const element of entries) {
        objs.push(element)
      }

      return objs
    }
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export const getNextUserId = async (): Promise<number | any> => {
  await db.connectDb()

  return User.findOne().sort({ userId: -1 }).limit(1).then((entry: IUser | null) => {
    if (entry == null) {
      return 1
    } else {
      const obj: Partial<IUser> = {
        userId: entry.userId + 1
      }
      return obj.userId
    }
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function login(email: string, password: string): Promise<string | null> {
  try {
    if ((email.length > 0) && (password.length > 0)) {
      await db.connectDb()

      return User.findOne({ email }).then(async (user: IUser | null) => {
        if (user == null) {
          return null
        }

        const passMatch = await bcrypt.compare(password, user.password)

        if ((user != null) && passMatch) {
          let accessTypes: string[] = []

          const userTypes = Object.values(AccessTypes) as any[]
          const adminUserTypes = Object.values(AdminAccessTypes) as any[]

          if (user.profile === 'admin') {
            accessTypes = adminUserTypes
          } else {
            accessTypes = userTypes
          }

          const payload: TokenPayload = {
            name: user.name,
            email: user.email,
            userId: user.userId,
            accessTypes
          }

          return generateToken(payload)
        } else {
          console.log('password invalid for: ' + email)
          return null
        }
      }).catch((e: any) => {
        console.log('user not found', e)
        throw new Error(e)
      })
    } else {
      console.log('Invalid Data')
      return null
    }
  } catch (e: any) {
    console.log('error')
    console.log(e.message)
    return null
  }
}

export async function findByUserId(userId: number): Promise<IUser | any> {
  await db.connectDb()

  return User.findOne({ userId }).then((entry: IUser | null) => {
    return entry
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function findByEmail(email: string): Promise<IUser | any> {
  await db.connectDb()
  return User.findOne({ email: email }).then((entry: IUser | null) => {
    return entry
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function findMeByUserId(userId: string): Promise<IUser | any> {
  await db.connectDb()
  return User.findOne({ userId }).then((entry: IUser | null) => {
    const obj: Partial<IUser> = {
      userId: entry?.userId,
      name: entry?.name,
      email: entry?.email,
      profile: entry?.profile
    }
    return obj
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function findById(id: string): Promise<IUser | any> {
  await db.connectDb()
  return User.findById(id).then((entry: IUser | null) => {
    return entry
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function register(parsedUserEntry: INewUserEntry): Promise<IUser | any> {
  await db.connectDb()
  const newUserEntry: INewUserEntry = new User({
    name: parsedUserEntry.name,
    email: parsedUserEntry.email,
    userId: parsedUserEntry.userId,
    enabled: true,
    password: parsedUserEntry.password,
    profile: parsedUserEntry.profile
  })
  return await newUserEntry.save().then(() => {
    return newUserEntry
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function setUserPassword(id: string, pass: string): Promise<void> {
  await User.findByIdAndUpdate(id, { password: pass })
}
