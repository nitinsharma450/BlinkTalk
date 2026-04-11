import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName:{type:String ,unique:true},
    phoneNo:{type:String ,unique:true},
    phoneSuffix:{type:String},
    email:{type:String,unique:true,lowercase:true},
    about:{type:String},
    emailOtp:{type:String},
    emailOtpExpiry:{type:Date},
    profilePicture:{type:String},
    isOnline:{type:Boolean},
    lastSeen:{type:Date},
    isVarified:{type:Boolean}

})

export const UserSchema=mongoose.model("user",userSchema)