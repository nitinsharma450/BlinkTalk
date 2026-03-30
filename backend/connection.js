import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const MONGO_URI=process.env.MONGO_URI;

 async function MongoDB(){
    try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to mongoDB');

    } catch (error) {
       console.error("❌ Database connection failed:", error.message);
        
    }
      
}