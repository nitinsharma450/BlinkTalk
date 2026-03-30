import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import cookies from 'cookie-parser';

const app=express();
app.use(express.cors());
app.use(express.json());


app.listen(5000, ()=>{
    console.log("server is running on port 5000")
})