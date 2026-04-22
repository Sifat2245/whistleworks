import axios from "axios";
import { toast } from "react-hot-toast";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN;

const axiosSecureInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  timeout: 30000,
});

// Request interceptor
axiosSecureInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosSecureInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Something went wrong!!!";

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.response.status === 500) {
        errorMessage = "Internal server error, try again.";
      }
    } else if (error.request) {
      errorMessage = "Network issue, try again.";
    } else {
      errorMessage = "Request failed.";
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosSecureInstance;
