import express from 'express'
import * as Auth from './../middlewares/auth.middleware'
import { getEntries, findByIdWithoutSensitiveInfo, findById, addDiary, updateDiary, deleteDiary } from '../Controllers/diaryController'

const router = express.Router()

router.route('/').get(Auth.authorize(['getEntries']), getEntries)

router.route('/:id').get(Auth.authorize(['findByIdWithoutSensitiveInfo']), findByIdWithoutSensitiveInfo)

router.route('/full/:id').get(Auth.authorize(['findById']), findById)

router.route('/').post(Auth.authorize(['addDiary']), addDiary)

router.route('/:id').post(Auth.authorize(['updateDiary']), updateDiary)

router.route('/:id').delete(Auth.authorize(['deleteDiary']), deleteDiary)

export default router
