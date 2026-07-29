import { useQuery, useMutation } from "@tanstack/react-query";
import { useCampRegistrationService } from "@/services/referee-services/RefereeCampRegistration.service";

// Fetch camp pricing (director_price + sports_fee)
export const useCampPrice = (campId) => {
  const { campPrice } = useCampRegistrationService();

  return useQuery({
    queryKey: ["camp-price", campId],
    queryFn: async () => {
      const response = await campPrice(campId);
      return response?.data?.data || null;
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
  });
};

// Apply a coupon code (mutation) 
export const useApplyCoupon = () => {
  const { applyCoupon } = useCampRegistrationService();

  return useMutation({
    mutationFn: ({ campId, couponCode }) =>
      applyCoupon(campId, { coupon_code: couponCode }),
  });
};
