import useAxiosPublic from "@/hooks/useAxiosPublic"

export const useCMSService = () => {
    const axiosInstance = useAxiosPublic();

    return {
        getHomeCms: () => axiosInstance.get("/cms/home"),
        getAboutCms: () => axiosInstance.get("/cms/about"),
    }
}