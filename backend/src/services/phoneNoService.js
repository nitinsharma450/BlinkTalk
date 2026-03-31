import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()
const serviceId=process.env.TWILIO_SERVICE_SID;
const accountSid=process.env.TWILIO_ACCOUNT_SID;
const authToken=process.env.TWILIO_AUTH_TOKEN;          

const client=twilio(accountSid,authToken);

export async function sendOptToPhone(phoneNo){
 try {
    if(!phoneNo){
         throw new Error('phone number is required')
    }

    const response=await client.verify.services(serviceId).verifications.create({
        to:phoneNo,
        channel:'sms'
    })
    return response;
 } catch (error) {
    console.error('Failed to send OTP:', error.message);
    throw error;
 }
}

export async function verifyOpt(phoneNo,otp){
console.log(otp);
console.log(phoneNo)

try {
    const response=await client.verify.services(serviceId).verificationChecks.create({
        to:phoneNo,
        code :otp
    })
    
    console.log(response)
    return response
} catch (error) {
    console.lof(error.message)
    throw new error('otp verfication failed!');
}


}