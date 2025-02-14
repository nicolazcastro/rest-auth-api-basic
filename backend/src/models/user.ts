import { Schema, Document } from 'mongoose'

export interface IUser extends Document{
  name: string
  email: string
  enabled: boolean
  profile: string
  password: string
  token: string
  userId: number
}

export const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enabled: { type: Boolean, required: true },
  profile: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  userId: { type: Number, required: true, unique: true }
})

export interface INewUserEntry extends Omit<IUser, 'id'>{}
export type NewUserEntry = Omit<IUser, 'id'>
