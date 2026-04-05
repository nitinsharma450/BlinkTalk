import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL;
export const axiosInstance= axios.create({
    baseURL:baseUrl,
    withCredentials:true
})