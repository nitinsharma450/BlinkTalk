import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log("token not foung")
    return res.status(401).json({ message: "Not authenticated" });

  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message)
    return res.status(401).json({ message: "Invalid token" });
  }
};