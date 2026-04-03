import mongoose from 'mongoose'

const status=mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'},
  content:{type:String},
  contentType:{type:String,enum:["text","image","video"]},
  createdAt:{type:Date,default:Date.now},
  expiresAt:{type:Date,default:()=>Date.now()+24*60*60*1000},
  viewers:{type:[{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'}]}
})

export const StatusSchema = mongoose.model('status', status)