import { useState } from "react";
import { axiosInstance } from "../../services/urlService";
import countries from "../../utils/Contriles";
import useLoginStore from "../../store/useLoginStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Login() {
  const { step, setStep, userPhoneData, setUserPhoneData, resetLoginState } =
    useLoginStore();

  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [selectedCountry, setSelectedCountry] = useState(countries);

  const loginValidationSchema = yup
    .object()
    .shape({
      phoneNumber: yup
        .string()
        .nonNullable()
        .notRequired()
        .matches(/^\d+$/, "  Phone Number Must be Digit")
        .transform((value, originalValue) => {
          originalValue.trim() === "" ? null : value;
        }),
      email: yup
        .string()
        .nonNullable()
        .notRequired()
        .email("please enter valid email")
        .transform((value, originalValue) => {
          originalValue.trim() === "" ? null : value;
        }),
    })
    .test(
      "at-least-one",
      "Either phone number or email is required",
      function (value) {
        return !!(value.email || value.phoneNumber);
      },
    );

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

  return <></>;
}
