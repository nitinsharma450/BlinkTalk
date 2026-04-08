import { useState } from "react";
import { axiosInstance } from "../../services/urlService";
import countries from "../../utils/Contriles";
import useLoginStore from "../../store/useLoginStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useNavigation } from "react-router";
import useUserStore from "../../store/useUserStore";
import { useForm } from "react-hook-form";
import { avatars } from "../../utils/data";
import { useThemeStore } from "../../store/useThemeStore";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";


export default function Login() {
  const { step, setStep, userPhoneData, setUserPhoneData, resetLoginState } =
    useLoginStore();

  const { theme, setTheme } = useThemeStore();

  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [error, setError] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const[showDropDown,setShowDropDown]=useState(false)
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const loginValidationSchema = yup
    .object()
    .shape({
      phoneNumber: yup
        .string()
        .nonNullable()
        .notRequired()
        .matches(/^\d+$/, "  Phone Number Must be Digit")
        .transform((value, originalValue) =>
          originalValue.trim() === "" ? null : value,
        ),
      email: yup
        .string()
        .nonNullable()
        .notRequired()
        .email("please enter valid email")
        .transform((value, originalValue) =>
          originalValue.trim() === "" ? null : value,
        ),
    })
    .test(
      "at-least-one",
      "Either phone number or email is required",
      function (value) {
        return !!(value.email || value.phoneNumber);
      },
    );

  const otpValidation = yup.object().shape({
    otp: yup
      .string()
      .length(6, "otp must be of 6 length")
      .required("otp is required"),
  });

  const ProfileValidationSchema = yup.object().shape({
    userName: yup.string().required("userName is required"),
    agreed: yup.bool().oneOf([true], "you must agreed with the term"),
  });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(loginValidationSchema) });

  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({ resolver: yupResolver(otpValidation) });

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profilerrors },
    watch,
  } = useForm({ resolver: yupResolver(ProfileValidationSchema) });

  async function sendOtp(phoneNo: any, email: any, phoneSuffix: any) {
    try {
      let response = await axiosInstance.post("/api/auth/sendotp", {
        phoneNo,
        email,
        phoneSuffix,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function verifyOtp(
    phoneNo: any,
    email: any,
    otp: any,
    phoneSuffix: any,
  ) {
    let response = await axiosInstance.post("/api/auth/verifyotp", {
      phoneNo,
      email,
      otp,
      phoneSuffix,
    });
    console.log(response?.data.message);
  }

  async function checkAuth() {
    try {
      let response = await axiosInstance.post("/api/auth/checkauth");
      if (response.data.status == 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      let response = await axiosInstance.post("/api/auth/logout");
      if (response) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const ProgressBar=()=>(
    <div className={`w-full ${theme==='dark'?'bg-gray-700':'bg-gray-200'} rounded-full h-2.5 mb-6`}>

      <div className="bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{width:`${(step/3)*100}%`}}>

      </div>
    </div>
  )

  return (
    <>
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-green-400 to-blue-500"} flex items-center justify-center p-4 overflow-hidden`}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white"} p-6 md:p-8 rounded-lg shadow-2xlw-full max-w-md relative z-10`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-24 h-24 bg-green-300 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <FaWhatsapp className="w-15 h-15 text-white" />
          </motion.div>

          <h1 className={`text-3xl font-bold text-center mb-6 ${theme==='dark'?'text-white':'text-gray-600'}`}>Whatsapp Login</h1>
          <ProgressBar />
        </motion.div>
      </div>
    </>
  );
}
