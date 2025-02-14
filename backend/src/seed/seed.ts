import { Seeder } from 'mongo-seeding'
import bcrypt from 'bcrypt'
import * as userServices from '../services/users/usersServices'
import path from 'path'

const config = {
  database: {
    name: 'authapi'
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

    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    process.exit(0)
  })
