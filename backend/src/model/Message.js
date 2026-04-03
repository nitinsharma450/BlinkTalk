import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    conversation:{type:mongoose.Schema.Types.ObjectId,ref:'conversationSchema'},
content:{type:String},
imageOrVideo:{type:String},
sender:{type:mongoose.Schema.Types.ObjectId , ref:"UserSchema"}, 
reciever:{type:mongoose.Schema.Types.ObjectId , ref:"UserSchema"},
contexttype:{type:String,enum:["text","image","video"]},
reaction:[{emoji:{type:String},user:{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'}}],
messageStatus:{type:String}
})

export const MessageSchema = mongoose.model("message",messageSchema)