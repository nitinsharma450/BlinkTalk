import express from 'express';
import { authController } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
 

export const authRouter=express.Router();
authRouter.post('/sendOpt',authController.sendOtp)
authRouter.post('/verifyOtp',authController.verifyOtp)

authRouter.use(authMiddleware);