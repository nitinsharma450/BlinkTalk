import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const MONGO_URI = process.env.MONGO_URI;
console.log("ewew",MONGO_URI);

export async function MongoDB() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not defined in .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // stop app if DB fails
  }
}