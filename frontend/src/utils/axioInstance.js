import axios from "axios"

const BASE_URL = "https://task-manager-app-jish.onrender.com/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default axiosInstance