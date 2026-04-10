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
import { FaChevronDown, FaUser, FaWhatsapp } from "react-icons/fa";
import { p } from "framer-motion/client";
import { CgSpinner } from "react-icons/cg";
import Spinner from "../../utils/Spinner";
import { toast } from "react-toastify";

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
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading,setLoading]=useState(false)
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
      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  async function loginHandle(){
    if(email){
     let response=await sendOtp(null,email,null)
     if(response.data.message==='success'){
      toast.info("Opt send to you email")

      setUserPhoneData({email})
      setStep(2)
     }
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

  const ProgressBar = () => (
    <div
      className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2.5 mb-6`}
    >
      <div
        className="bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  );

  const filterCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm),
  );

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

          <h1
            className={`text-3xl font-bold text-center mb-6 ${theme === "dark" ? "text-white" : "text-gray-600"}`}
          >
            Whatsapp Login
          </h1>
          <ProgressBar />

          {step === 1 && (
            <form className="space-y-4">
              <p
                className={`text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}
              >
                Enter your Phone Number to receive an OTP
              </p>
              <div className="relative">
                <div className="flex">
                  <div className="relative w-1/3">
                    <button
                      onClick={() => setShowDropDown(!showDropDown)}
                      type="button"
                      className={`flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-white"} border rounded-s-lg hover:bg-gray-200 focus:right-4 focus:outline-none focus:ring-gray-100`}
                    >
                      <span>
                        {selectedCountry.flag} {selectedCountry.dialCode}
                      </span>
                      <FaChevronDown className="ml-2" />
                    </button>

                    {showDropDown && (
                      <div
                        className={`absolute z-10 w-full mt-1 ${theme === "dark" ? "bg-gray-700" : "bg-white border-gray-300"}`}
                      >
                        <div
                          className={`sticky top-0 ${theme === "dark" ? "bg-gray-600" : "bg-white"} p-2`}
                        >
                          <input
                            type="text"
                            placeholder="Search Countries"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                            className={`w-full px-2 py-1 border ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white border-gray-300"} rounded-md text-sm focus:outline-none focus:right-2 focus:ring-green-500`}
                          />
                        </div>

                        {filterCountries.map((country) => {
                          return (
                            <button
                              onClick={() => {
                                (setSelectedCountry(country),
                                  setShowDropDown(false));
                              }}
                              className={`w-full text-left px-3 py-2 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"} focus:outline-none focus:bg-gray-100`}
                            >
                              {country.flag} {country.dialCode} {country.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    {...loginRegister("phoneNumber")}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-2/3 px-4 py-2 border  ${theme === "dark" ? "text-white bg-gray-600 border-gray-700" : " border-gray-300"} rounded-md focus:outline-none focus:right-2 focus:ring-green-200 ${loginErrors.phoneNumber ? "border-red-500" : ""}`}
                  />
                </div>
                {loginErrors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {loginErrors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="flex items-center" my-4>
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-gray-500 text-sm font-medium">
                  Or
                </span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <div
                className={`flex items-center border rounded-md px-3 py-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaUser
                  className={`mr-2 text-gray-400 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />

                <input
                  type="email"
                  {...loginRegister("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className={`w-full px-4 py-2 border ${
                    theme === "dark"
                      ? " text-white"
                      : "bg-white"
                  }${
                    loginErrors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
              </div>
               {loginErrors.email && (
                  <p className="text-red-500 text-sm">
                    {loginErrors.email.message}
                  </p>
                )}

                <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">{!loading ?<Spinner />:'Send Otp'}</button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
