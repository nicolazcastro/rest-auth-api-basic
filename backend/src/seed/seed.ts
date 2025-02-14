import { Seeder } from 'mongo-seeding'
import bcrypt from 'bcrypt'
import * as diaryServices from '../services/diaries/diariesServices'
import * as userServices from '../services/users/usersServices'
import path from 'path'

const config = {
  database: {
    name: 'diarydb'
  },
  dropDatabase: true
}
const seeder = new Seeder(config)

const collectionReadingOptions = {
  extensions: ['ts', 'js', 'cjs', 'json'],
  ejsonParseOptions: {
    relaxed: false
  },
  transformers: [
    Seeder.Transformers.replaceDocumentIdWithUnderscoreId
  ]
}

const collections = seeder.readCollectionsFromPath(path.resolve('./src/seed/data'), collectionReadingOptions)

seeder
  .import(collections)
  .then(async () => {
    console.log('Seed OK')

    const users = await userServices.getUsers()
    const salt = await bcrypt.genSalt(6)

    for (const element of users) {
      console.log('Setting password to user: ', element)
      await userServices.setUserPassword(element.id, await bcrypt.hash(element.password, salt))
    }

    const diaries = await diaryServices.getEntries()
    for (const diary of diaries) {
      console.log('Result from diaries service: ', diary)
      await diaryServices.setDiaryUser(diary)
    }
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    process.exit(0)
  })
