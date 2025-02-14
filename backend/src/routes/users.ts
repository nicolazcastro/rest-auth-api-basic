import express from 'express'
import * as Auth from './../middlewares/auth.middleware'
import { register, me, login, getUsers } from '../Controllers/userController'

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(Auth.authorize(['me']), me)
router.route('/all').get(Auth.authorize(['getUsers']), getUsers)

export default router
