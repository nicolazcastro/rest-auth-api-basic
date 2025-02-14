import { Schema, Document } from 'mongoose'
import { Visibility, Weather } from './enums'

export interface DiaryUser {
  type: Schema.Types.ObjectId
  ref: 'IUser'
}

export interface IDiaryEntry extends Document {
  date: string
  weather: Weather
  visibility: Visibility
  comment?: string
  userId: number
  user: DiaryUser
}

export const DiarySchema: Schema = new Schema({
  date: { type: String, required: true },
  weather: { type: String, required: true },
  visibility: { type: String, required: true },
  comment: { type: String, required: true },
  userId: { type: Number, required: true },
  user: { type: Object, required: true }
})

export interface INonSensitiveInfoDiaryEntry extends IDiaryEntry { }
export interface INewDiaryEntry extends Omit<IDiaryEntry, 'id'> { }
export interface IParsedDiaryEntry extends Omit<IDiaryEntry, 'id' | 'user'> { userId: number }
export type NewDiaryEntry = Omit<IDiaryEntry, 'id'>
