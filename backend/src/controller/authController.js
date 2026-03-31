import otpGenerator from "../utils/otpGenerator.js";
import User from "../model/User.js";
import { sendOtpToPhone, verifyOpt } from "../services/phoneNoService.js";
import { sendOtpToEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";

async function sendOtp(req, res) {
  const { phoneNo, email, phoneSuffix } = req.body;

  if (!phoneNo && !email) {
    return res.status(400).json({ message: "Phone or Email required" });
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
      message: "OTP sent to phone",
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

    await sendOtpToEmail(email, otp);

    return res.status(200).json({
      message: "OTP successfully sent to youremail",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phoneNo, email, otp, phoneSuffix } = req.body;

    if (!phoneNo || !email) {
      return res.status(400).json({ message: "Phone or Email required" });
    }

    if (email) {
      let userInfo = await User.findOne({ email });
      if (userInfo.emailOtp === otp && userInfo.emailOtpExpiry > Date.now()) {
        userInfo.isVerified = true;
        userInfo.otp = null;
        userInfo.emailOtpExpiry = null;
        await userInfo.save();

        const token = jwt.sign(
          { id: userInfo._id, email: userInfo.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3h" },
        );

        return res.send({
          message: "opt verify successfylly",
          Token: token,
          user: userInfo,
        });
      } else {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
    }

    if (phoneNo) {
      let userInfo = await User.findOne({ phoneNo });
      if (!userInfo) {
        return res.status(400).send({ message: "User not found" });
      }
      let phoneNumber = `${phoneSuffix}${phoneNo}`;
      let result = await verifyOpt(phoneNumber, otp);

      if (result.status != "approved") {
        return res.status(400).send({ message: "Invalid or expired OTP" });
      }
      userInfo.isVerified = true;
      await userInfo.save();

      const token = jwt.sign(
        { id: userInfo._id, email: userInfo.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3h" },
      );

      return res.send({
        message: "opt verify successfylly",
        Token: token,
        user: userInfo,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
