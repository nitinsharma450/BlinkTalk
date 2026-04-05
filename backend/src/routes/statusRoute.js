import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { statusController } from '../controller/statusController.js'

export const statusRoute=express.Router()

statusRoute.use(authMiddleware)

statusRoute.post('/createstatus',statusController.createStatus)
statusRoute.post('/getstatus',statusController.getStatus)
statusRoute.post('/viewstatus/:statusId',statusController.viewStatus)
statusRoute.post('/deletestatus/:statusId',statusController.deleteStatus)
