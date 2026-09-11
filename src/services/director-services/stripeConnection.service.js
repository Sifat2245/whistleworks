import useAxiosSecure from "@/hooks/useAxiosSecure";


export const useStripeService = () => {
    const axiosInstance = useAxiosSecure();

    return {
        connectStripe: async () => axiosInstance.post("/v1/director/stripe/connect"),
        connectionStatus: async () =>{
            const response = await axiosInstance.get("/v1/director/stripe/status");
            return response?.data;
        },
        stripeDashboardRedirection: async () =>{
            const response = await axiosInstance.get("/v1/director/stripe/dashboard");
            return response?.data;
        }
    }
}