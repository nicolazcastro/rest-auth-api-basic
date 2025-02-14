import { Weather, Visibility } from '../../models/enums'
import validator from 'validator'

const parseUser = (userFromRequest: any): string => {
  if (!isString(userFromRequest) || userFromRequest === '') {
    throw new Error('Incorrect or missing user')
  }
  return userFromRequest
}
const parseComment = (commentFromRequest: any): string => {
  if (!isString(commentFromRequest) || commentFromRequest === '') {
    throw new Error('Incorrect or missing comment')
  }
  return commentFromRequest
}
const parseDate = (dateFromRequest: any): string => {
  if (!isDate(dateFromRequest) || !isString(dateFromRequest)) {
    throw new Error('Incorrect or missing date')
  }
  return dateFromRequest
}

const parseWeather = (weatherFromRequest: any): Weather => {
  if (!isString(weatherFromRequest) || !isWeather(weatherFromRequest)) {
    throw new Error('Incorrect or missing weather')
  }
  return weatherFromRequest
}

const parseVisibility = (visibilityFromRequest: any): Visibility => {
  if (!isString(visibilityFromRequest) || !isVisibility(visibilityFromRequest)) {
    throw new Error('Incorrect or missing visibility')
  }
  return visibilityFromRequest
}
const isWeather = (param: any): boolean => {
  return Object.values(Weather).includes(param)
}

const isVisibility = (param: any): boolean => {
  return Object.values(Visibility).includes(param)
}

const isString = (string: string): boolean => {
  return typeof string === 'string'
}

const isDate = (date: string): boolean => {
  return validator.isDate(date)
}

const toNewDiaryEntry = (object: any): any => {
  const newEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility),
    userId: parseUser(object.userId)
  }

  return newEntry
}

const toUpdatedDiaryEntry = (object: any): any => {
  const updatedEntry = {
    comment: object.comment ? parseComment(object.comment) : undefined,
    date: object.date ? parseDate(object.date) : undefined,
    weather: object.weather ? parseWeather(object.weather) : undefined,
    visibility: object.visibility ? parseVisibility(object.visibility) : undefined
  }

  // Remove undefined fields
  return Object.fromEntries(Object.entries(updatedEntry).filter(([_, value]) => value !== undefined));
}

export { toNewDiaryEntry, toUpdatedDiaryEntry }
