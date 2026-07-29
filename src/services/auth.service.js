import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useAuthService = () => {
  const axiosInstance = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  return {
    signIn: (data) => axiosInstance.post("/login", data),
    signUp: (data) =>
      axiosInstance.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    verifyEmail: (data) => axiosInstance.post("/verify-email", data),
    resendOtp: (data) => axiosInstance.post("/resend-otp", data),
    forgotPassword: (data) =>
      axiosInstance.post("/forgot-password", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    verifyResetOtp: (data) =>
      axiosInstance.post("/otp-token", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    resetPassword: (data) =>
      axiosInstance.post("/reset-password", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    // Profile / avatar (auth required)
    updateAvatar: (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return axiosSecure.post("/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    updateProfile: (payload) =>
      axiosSecure.post("/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  };
};
