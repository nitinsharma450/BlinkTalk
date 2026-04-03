
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    participant:[{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'}],
    unreadMessageCount:{type:Number,default:0},
    lastMessage:{type:mongoose.Schema.Types.ObjectId,ref:'MessageSchema'},

})

export const ConversationSchema = mongoose.model("conversation",conversationSchema)