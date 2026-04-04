import { Server } from "socket.io";
import dotenv from "dotenv";
import { UserSchema } from "../model/User";
import { MessageSchema } from "../model/Message";
dotenv.config();

const onlineUser = new Map();
const typingUser = new Map();

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

    socket.io("get_user_status", (userId, callback) => {
      const onlineStatus = onlineUser.has(userId);
      callback({
        userId: userId,
        isOnline: onlineStatus,
        lastSeen: onlineStatus || Date.now(),
      });
    });

    socket.io("message_read", async (messageIds, senderId) => {
      MessageSchema.updateMany({
        _id: { $in: messageIds },
        $set: { messageStatus: "read" },
      });

      const sockerSenderId = isOnline.get(senderId);

      if (sockerSenderId) {
        messageIds.forEach((messageId) => {
          io.to(sockerSenderId).emit("message_status_update", {
            messageId,
            messageStatus: "read",
          });
        });
      }
    });

    socket.on("typing_start", (conversationId, recevierId) => {
      if (!conversationId || !recevierId) {
        return;
      }

      if(!typingUser.has(userId)){
        typingUser.set(userId,{})
      }
      const userTyping=typingUser.get(userId)

      if(userTyping){
        userTyping[conversationId]=true
      }
      if(userTyping[`${conversationId}_timeout`]){
        clearTimeout(userTyping[`${conversationId}_timeout`])
      }

      userTyping[`${conversationId}_timeout`]=setTimeout(()=>{
       userTyping[conversationId]=false
       socket.to(recevierId).emit('user_typing',{
        userId,
        conversationId,
        isTyping:false
       })  
      },3000)

      socket.to(recevierId).emit('user_typing',{
        userId,
        conversationId,
        istyping:true
      })
    });
  });
}
