import optGenerator from '../utils/optGenerator.js'
import User from '../model/User.js'

async function sendOpt(req,res){
  let {phoneNo,email,PhoneSuffix}=req.body;
let opt=await optGenerator()

let user;
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