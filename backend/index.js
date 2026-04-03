import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
 
import {MongoDB} from "./connection.js";
import { authRouter } from "./src/routes/authRoute.js";
import { chatRoute } from "./src/routes/chatRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());


app.use('api/auth',authRouter)
app.use('api/chat',chatRoute)

const PORT = process.env.PORT;

MongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
});
