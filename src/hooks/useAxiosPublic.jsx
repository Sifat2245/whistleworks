import axios from "axios";
import toast from "react-hot-toast";

const useAxiosPublic = () => {
    const baseURL = `${import.meta.env.VITE_BASE_URL}/api`;
    const axiosPublic = axios.create({
        baseURL: baseURL,
        timeout: 30000,
    });
    // axios response interceptor
    axiosPublic.interceptors.response.use((response) => response,
        (error) => {
            // skip handling for canceld requests
            if (axios.isCancel(error)) {
                // do something
                return Promise.reject(error)
            }
            // server responded with errors status
            if (error.response) {
                // only show toast for server errors
                if (error.response.status >= 500) {
                    const serverMessage = error.response.data?.message;
                    const errorMessage = serverMessage || "Our server are having issues. Please try again later";
                    toast.error(errorMessage);
                }
            }
            // No response received (network issue)
            else if (error.request) {
                toast.error("Network connection issue. Please check your internet.")
            };
            return Promise.reject(error)
        }
    );
    return axiosPublic
};
export default useAxiosPublic