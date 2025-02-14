import * as db from '../../db/db'
import * as diaryServices from '../../services/diaries/diariesServices'
import * as userServices from '../../services/users/usersServices'
import toNewDiaryEntry from '../../services/diaries/diaryUtils'
import { faker } from '@faker-js/faker'
import { Weather, Visibility } from '../../models/enums'
import toNewUserEntry from '../../services/users/userUtils'
import { INewUserEntry } from '../../models/user'
import validator from 'validator'

const Diary = db.getDiaryModel()
const User = db.getUserModel()
describe('Diaries Testing', () => {
  beforeAll(async () => {
    if (await db.collectionExist('diaries')) {
      await Diary.collection.drop()
    }

    if (await db.collectionExist('users')) {
      await User.collection.drop()
    }
    await db.connectDb()
  })

  afterAll(async () => {
    await Diary.collection.drop()
    await User.collection.drop()
    await db.disconnectDb()
  })

  it('Diaries Get Entries Test', async () => {
    const diaries: any[] = []
    let diaryInput: any

    const randomEnumValue = (enumeration: any): string => {
      const values = Object.keys(enumeration)
      const enumKey = values[Math.floor(Math.random() * values.length)]
      return enumeration[enumKey]
    }

    const parsedUserEntry: INewUserEntry = await toNewUserEntry({
      name: 'nicolas castro',
      email: 'nicolas@ddd.com',
      profile: 'user',
      password: 'Nicolas1',
      userId: 1
    })

    await userServices.register(parsedUserEntry)

    const weather = randomEnumValue(Weather)
    const visibility = randomEnumValue(Visibility)

    for (let i = 0; i < 5; i++) {
      const fakeDate = faker.date.between('2015-01-01', '2022-01-05')
      const stringDate = String(fakeDate.getFullYear()) + '/' + ('0' + String((fakeDate.getMonth() + 1))).slice(-2) + '/' + ('0' + String(fakeDate.getDate())).slice(-2)

      diaryInput = {
        date: stringDate,
        weather: weather,
        visibility: visibility,
        comment: faker.word.adjective(50),
        userId: '1'
      }
      diaries.push(toNewDiaryEntry(diaryInput))
    }

    for (const parsedDiaryEntry of diaries) {
      await diaryServices.addDiary(parsedDiaryEntry)
    }

    await diaryServices.getEntries().then((entries: any[]) => {
      expect(entries).toBeDefined()
      expect(entries).toBeInstanceOf(Array)

      for (const entry of entries) {
        expect(validator.isDate(entry.date)).toEqual(true)
        expect(entry.weather).toBe(weather)
        expect(entry.visibility).toBe(visibility)
      }
    }).catch((e: any) => {
      console.log(e)
      throw new Error(e)
    })
  })
})
