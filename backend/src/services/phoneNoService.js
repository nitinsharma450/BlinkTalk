import twilio from 'twilio'
import dotenv from 'dotenv'


dotenv.config();

const serviceId = process.env.TWILIO_SERVICE_SID;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function sendOtpToPhone(phoneNo, phoneSuffix) {
  try {
    // ✅ Validate inputs first
    if (!phoneNo || !phoneSuffix) {
      throw new Error("Phone number and country code are required");
    }

    // ✅ Clean input
    const cleanPhone = phoneNo.replace(/\s+/g, "");

    // ✅ Format to E.164
    const fullPhone = `${phoneSuffix}${cleanPhone}`;

    console.log("Formatted Phone:", fullPhone);

    // ✅ Strong validation
    if (!/^\+\d{10,15}$/.test(fullPhone)) {
      throw new Error("Invalid phone format. Use +919876543210");
    }

    // ✅ Send OTP via Twilio
    const response = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: fullPhone,
        channel: "sms",
      });

    console.log("OTP sent:", response.sid);

    return response;

  } catch (error) {
    console.error(
      "Failed to send OTP:",
      error?.response?.data || error.message
    );

    throw new Error("Failed to send OTP");
  }
}

export async function verifyOtp(phoneNo,otp){
console.log(otp);
console.log("verify number",phoneNo)

try {
    const response=await client.verify.v2.services(serviceId).verificationChecks.create({
        to:phoneNo,
        code :otp
    })
    
    console.log(response)
    return response
} catch (error) {
    console.log(error.message)
    throw new Error('otp verfication failed!');
}


}