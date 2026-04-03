import express from 'express';
import { chatController } from '../controller/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const chatRoute=express.Router()

chatRoute.use(authMiddleware)

chatRoute.post('/sendmessage',chatController.sendMessage)
chatRoute.post('/getmessage/:conversationId',chatController.getMessage)
chatRoute.post('/markasread',chatController.markAsRead)
chatRoute.post('/deleteMessage/:messageId',chatController.deleteMessage)