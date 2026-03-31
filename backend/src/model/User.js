import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName:{type:String ,required:true,unique:true},
    phoneNo:{type:String ,required:true,unique:true},
    PhoneSuffix:{type:String,required:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    about:{type:String},
    emailOtp:{type:String},
    emailOtpExpiry:{type:Date},
    profilePicture:{type:String},
    isOnline:{type:Boolean},
    lastSeen:{type:Date}

})

export const UserSchema=mongoose.model("user",userSchema)