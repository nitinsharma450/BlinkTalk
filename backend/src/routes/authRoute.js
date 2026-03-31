import express from 'express';
import { authController } from '../controller/authController.js';
 

export const authRouter=express.Router();
authRouter.post('/sendOpt',authController.sendOtp)
authRouter.post('/verifyOtp',authController.verifyOtp)