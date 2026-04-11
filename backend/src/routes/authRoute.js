import express from 'express';
import { authController } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { userController } from '../controller/userController.js';
 

export const authRouter=express.Router();
authRouter.post('/sendOtp',authController.sendOtp)
authRouter.post('/verifyOtp',authController.verifyOtp)
authRouter.post('/logout',authController.logout)

authRouter.use(authMiddleware);

authRouter.post('/updateprofile',userController.updateProfile)
authRouter.post('/checkauth',authController.isAuthencated)
authRouter.post('/allusers',userController.getAllUser)