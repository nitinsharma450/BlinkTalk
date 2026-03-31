import optGenerator from '../utils/optGenerator.js'
import User from '../model/User.js'

async function sendOtp(req,res){
  let {phoneNo,email,PhoneSuffix}=req.body;
  let user;

  if(!phoneNo || !PhoneSuffix){
    return res.status(400).send({message:'phone number and phone suffix are required'})
  }

  user=await User.findOne({phoneNo:phoneNo})
  if(!user){
    user=new User({phoneNo:phoneNo,PhoneSuffix:PhoneSuffix})
  }
  user.save();

let opt=await optGenerator()


if(email){
    let user=await User.findOne({email:email})
    if(!user){
        user=new User({email:user})
    }
   user.emailOtp=opt;
user.emailOtpExpiry=Date.now()+1000*60*5;

await user.save()

return res.status(200).send({message:'opt send successfully to you email'})
}




    
}