import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN;
const useAxiosSecure = () => {
    const baseURL = `${import.meta.env.VITE_BASE_URL}/api`;
    const { logout } = useAuth();
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const axiosSecure = axios.create({
        baseURL: baseURL,
        timeout: 30000,
        headers: {
            Authorization: `Bearer ${accessToken}`  
        }
    });
    // Note: Handle common error responses
    axiosSecure.interceptors.response.use(
        (response) => response,
        (error) => {
            let errorMessage = "Something went wrong!!!";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Session expired. Please log in again.";
                    toast.error(errorMessage);
                    logout();
                } else if (error.response.status === 500) {
                    errorMessage = "Internal server error, try again.";
                    toast.error(errorMessage);
                }
            } else if (error.request) {
                errorMessage = "Network issue, try again.";
                toast.error(errorMessage);
            } else {
                errorMessage = "Request failed.";
                toast.error(errorMessage);
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};
export default useAxiosSecure;