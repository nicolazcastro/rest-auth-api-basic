import * as diaryServices from '../services/diaries/diariesServices'
import { Request, Response } from 'express'
import { toNewDiaryEntry, toUpdatedDiaryEntry } from '../services/diaries/diaryUtils'

export function getEntries(_req: Request, res: Response): void {
  diaryServices.getEntries().then((diaries) => {
    console.log('Result from service: ')
    console.log(diaries)
    return (diaries != null) ? res.send(diaries) : res.sendStatus(404)
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export function findByIdWithoutSensitiveInfo(req: Request, res: Response): void {
  console.log(req.params.id)
  diaryServices.findByIdWithoutSensitiveInfo(req.params.id).then((diary) => {
    console.log('Result from service: ')
    console.log(diary)
    return (diary != null) ? res.send(diary) : res.sendStatus(404)
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export function findById(req: Request, res: Response): void {
  console.log(req.params.id)
  diaryServices.findById(req.params.id).then((diary) => {
    console.log('Result from service: ')
    console.log(diary)
    return (diary != null) ? res.send(diary) : res.sendStatus(404)
  }).catch((e: any) => {
    console.log(e)
    throw new Error(e)
  })
}

export async function addDiary(req: Request, res: Response): Promise<void> {
  try {
    const parsedDiaryEntry = toNewDiaryEntry(req.body)
    console.log(parsedDiaryEntry)

    diaryServices.addDiary(parsedDiaryEntry).then((diary) => {
      console.log('Result from added new entry: ')
      console.log(diary)
      return (diary != null) ? res.send(diary) : res.sendStatus(201)
    }).catch((e: any) => {
      console.log(e)
      return res.status(400).send(e.message)
    })
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}

export function updateDiary(req: Request, res: Response): void {
  try {
    const parsedDiaryEntry = toUpdatedDiaryEntry(req.body)
    console.log(parsedDiaryEntry)

    diaryServices.updateDiary(req.params.id, parsedDiaryEntry).then((diary) => {
      console.log('Result from added new entry: ')
      console.log(diary)
      return (diary != null) ? res.send(diary) : res.sendStatus(200)
    }).catch((e: any) => {
      console.log(e)
      throw new Error(e)
    })
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}

export function deleteDiary(req: Request, res: Response): void {
  try {
    diaryServices.deleteDiary(req.params.id).then((diary) => {
      console.log('Result from deleted entry: ')
      console.log(diary)
      if (diary != null) {
        res.status(200).send(diary)
      } else {
        res.sendStatus(404)
      }
    }).catch((e: any) => {
      console.log(e)
      throw new Error(e)
    })
  } catch (e: any) {
    res.status(400).send(e.message)
  }
}
