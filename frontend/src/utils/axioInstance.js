import axios from "axios"

const BASE_URL = "https://task-manager-app-production-86de.up.railway.app/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default axiosInstance
