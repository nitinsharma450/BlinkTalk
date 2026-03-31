import otpGenerator from '../utils/otpGenerator.js';
import User from '../model/User.js';
import { sendOtpToPhone } from '../services/phoneNoService.js';
import { sendOtpToEmail } from '../services/emailService.js';
// import { sendOtpToEmail } from '../services/emailService.js';

async function sendOtp(req, res) {
  const { phoneNo, email, phoneSuffix } = req.body;

  if (!phoneNo && !email) {
    return res.status(400).json({ message: 'Phone or Email required' });
  }

  const otp = otpGenerator();

  // 📱 PHONE OTP FLOW
  if (phoneNo) {
    let user = await User.findOne({ phoneNo });

    if (!user) {
      user = new User({ phoneNo, phoneSuffix });
    }

    user.phoneOtp = otp;
    user.phoneOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtpToPhone(phoneNo);

    return res.status(200).json({
      message: 'OTP sent to phone'
    });
  }

  // 📧 EMAIL OTP FLOW
  if (email) {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

     await sendOtpToEmail(email,otp);

    return res.status(200).json({
      message: 'OTP successfully sent to youremail'
    });
  }
}

