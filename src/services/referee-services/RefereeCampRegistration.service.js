import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useCampRegistrationService = () => {
  const axiosInstance = useAxiosSecure();

  return {
    campPrice: (id) => axiosInstance.get(`/v2/referee/camp/${id}/pricing`),

    applyCoupon: (id, data) =>
      axiosInstance.post(`/v2/referee/camp/${id}/validate-coupon`, data),
  };
};
