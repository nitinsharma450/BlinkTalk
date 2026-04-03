import { Server } from "socket.io";
import dotenv from "dotenv";
import { UserSchema } from "../model/User";
dotenv.config();

const onlineUser=new Map();

export async function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id, "connected to the server");


       socket.on("connecting_user", async (userId) => {

    try {
         onlineUser.set(userId, socket.id);
    socket.join(userId);

    await UserSchema.findByIdAndUpdate(
      { _id: userId },
      { $set: { isOnline: true, lastSeen: Date.now() } },
    );
    } catch (error) {
        console.log(error.message);
    }
   
  });

  socket.io('get_user_status',(userId,callback)=>{
    const  onlineStatus=onlineUser.has(userId);
    callback({
        userId:userId,
        isOnline:onlineStatus,
        lastSeen:onlineStatus || Date.now()
    })
  })

  

  });
 
}
