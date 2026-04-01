import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function authMiddleware(req, res, next) {
  let header = req.header("authorization");

  if (header && typeof header === "string") {
    let chuncks = header.split(" ");
    if (chuncks.length === 2 && chuncks[0] === "Bearer") {
      if (chuncks == 2) {
        let token = chuncks[1];

        try {
          let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          req.user = decoded;
          next();
          return;
        } catch (error) {
            console.log(error.message)
            return res.status(403).send({message:'invalid token'});
        }
      }
    }
  }
}
