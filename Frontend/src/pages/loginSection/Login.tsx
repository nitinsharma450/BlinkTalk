import { axiosInstance } from "../../services/urlService";

export default function login() {
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



  return <>
  
  </>;
}
