import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
 
import {MongoDB} from "./connection.js";
import { authRouter } from "./src/routes/authRoute.js";
import { chatRoute } from "./src/routes/chatRoute.js";
import {initializeSocket} from '../backend/src/services/socketService.js'
import http from 'http'
import { statusRoute } from "./src/routes/statusRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());

const server=http.createServer(app)
const io=initializeSocket(server)

//apply socket middleware before routes
app.use((req,res,next)=>{
  req.io=io;
  req.sockerUserMap=io.sockerUserMap
  next();
})


app.use('api/auth',authRouter)
app.use('api/chat',chatRoute)
app.use('api/status',statusRoute)

const PORT = process.env.PORT;

MongoDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
});
