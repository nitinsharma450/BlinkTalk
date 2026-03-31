import { UserSchema } from "../model/User";

export class profileController{
static async updateProfile(req,res){
let {userName,about,profilePicture}=req.body;
try {
    let userId=req.user.userId;
    let response=await UserSchema.findByIdAndUpdate(userId,{$set:{userName:userName,about:about}})
    res.status(200).json({message:"Profile updated successfully", response:response})
} catch (error) {
    res.status(500).json({message:"Internal server error"})
}
}
}