import * as db from '../../db/db'
import bcrypt from 'bcrypt'

const User = db.getUserModel()
describe('userModel Testing', () => {
  beforeAll(async () => {
    await db.connectDb()
  })

  afterAll(async () => {
    await User.collection.drop()
    await db.disconnectDb()
  })

  it('userModel Create Test', async () => {
    const salt = await bcrypt.genSalt(6)

    const userInput: any = {
      name: 'juan perez',
      email: 'juan@perez.com',
      enabled: true,
      profile: 'admin',
      password: await bcrypt.hash('juan1', salt),
      token: '',
      userId: 99
    }

    const user = new User({ ...userInput })
    const createdUser = await user.save()
    expect(createdUser).toBeDefined()
    expect(createdUser.email).toBe(user.email)
    expect(createdUser.enabled).toBe(user.enabled)
    expect(createdUser.profile).toBe(user.profile)
    expect(createdUser.token).toBe(user.token)
    expect(createdUser.userId).toBe(user.userId)
  })
})
