import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookies from "cookie-parser";
import {MongoDB} from "./connection.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

MongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
});
