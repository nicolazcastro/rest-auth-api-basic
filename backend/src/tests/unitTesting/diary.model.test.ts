import * as db from '../../db/db'

const Diary = db.getDiaryModel()
describe('diaryModel Testing', () => {
  beforeAll(async () => {
    await db.connectDb()
  })

  afterAll(async () => {
    await Diary.collection.drop()
    await db.disconnectDb()
  })

  it('diaryModel Create Test', async () => {
    const diaryInput: any = {
      date: '02/02/2022',
      weather: 'sunny',
      visibility: 'good',
      comment: 'this is a comment',
      userId: 1,
      user: {
        type: db.getNewObjectId(),
        ref: 'IUser'
      }
    }

    const diary = new Diary({ ...diaryInput })
    const createdUser = await diary.save()
    expect(createdUser).toBeDefined()
    expect(createdUser.date).toBe(diary.date)
    expect(createdUser.weather).toBe(diary.weather)
    expect(createdUser.visibility).toBe(diary.visibility)
    expect(createdUser.userId).toBe(diary.userId)
    expect(createdUser.user).toMatchObject(diary.user)
  })
})
