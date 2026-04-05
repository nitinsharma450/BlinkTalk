import { axiosInstance } from "../../services/urlService";

export default function userOperation() {
  async function getAlluser() {
    try {
      let response = await axiosInstance.post("/api/auth/allusers");
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
