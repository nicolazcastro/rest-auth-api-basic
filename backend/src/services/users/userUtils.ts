import { Profile } from '../../models/enums'
import validator from 'validator'
import bcrypt from 'bcrypt'
import { getNextUserId } from './usersServices'

const parseName = (nameFromRequest: any): string => {
  if (!isString(nameFromRequest)) {
    throw new Error('Incorrect or missing name')
  }
  return nameFromRequest
}
const parsePassword = async (passwordFromRequest: any): Promise<any> => {
  if (!isString(passwordFromRequest) || !isPassword(passwordFromRequest)) {
    throw new Error('Incorrect or missing pasword')
  }
  const salt = await bcrypt.genSalt(6)
  return await bcrypt.hash(passwordFromRequest, salt)
}
const parseEmail = (emailFromRequest: any): string => {
  if (!isEmail(emailFromRequest) || !isString(emailFromRequest)) {
    throw new Error('Incorrect or missing email')
  }
  return emailFromRequest
}
const parseProfile = (emailFromRequest: any): string => {
  if (!isProfile(emailFromRequest) || !isString(emailFromRequest)) {
    throw new Error('Incorrect or missing profile')
  }
  return emailFromRequest
}

const isProfile = (param: any): boolean => {
  return Object.values(Profile).includes(param)
}

const isString = (string: string): boolean => {
  return typeof string === 'string'
}

const isPassword = (string: string): boolean => {
  const passOptions = {
    minLength: 4,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 0,
    minSymbols: 0,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10
  }
  return typeof string === 'string' && validator.isStrongPassword(string, passOptions)
}

const isEmail = (email: string): boolean => {
  return validator.isEmail(email)
}

const toNewUserEntry = async (object: any): Promise<any> => {
  const newId = await getNextUserId()
  const pass = await parsePassword(object.password)
  const newEntry = {
    name: parseName(object.name),
    userId: newId,
    email: parseEmail(object.email),
    profile: parseProfile(object.profile),
    enabled: true,
    password: pass
  }
  return newEntry
}

export default toNewUserEntry
