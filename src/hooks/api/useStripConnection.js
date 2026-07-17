import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripeService } from "@/services/stripeConnection.service";
import Swal from "sweetalert2";

export const useStripeConnectionStatus = () => {
  const { connectionStatus } = useStripeService();

  return useQuery({
    queryKey: ["stripe-connection-status"],
    queryFn: async () => {
      const data = await connectionStatus();
      return data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 30 * 60 * 1000, // 30 min cache
    refetchOnWindowFocus: false,
  });
};

export const useConnectStripe = () => {
  const { connectStripe } = useStripeService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["connect-stripe"],
    mutationFn: async () => {
      const response = await connectStripe();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      if (data?.onboarding_url) {
        Swal.fire({
          icon: "info",
          title: "Redirecting to Stripe...",
          text: "You will be redirected to Stripe to complete the onboarding process.",
          timer: 2000,
          showConfirmButton: false,
        });
        // Open Stripe onboarding in a new tab
        window.open(data.onboarding_url, "_blank");
      } else {
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Failed to generate Stripe onboarding link. Please try again.",
          confirmButtonColor: "#00AEEF",
        });
      }
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text:
          err?.response?.data?.message ||
          "Something went wrong! Please try again.",
        confirmButtonColor: "#00AEEF",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe-connection-status"] });
    },
  });
};

export const useStripeDashboard = () => {
  const { stripeDashboardRedirection } = useStripeService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["stripe-dashboard"],
    mutationFn: async () => {
      const data = await stripeDashboardRedirection();
      return data?.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to open Stripe dashboard. Please try again.",
          confirmButtonColor: "#00AEEF",
        });
      }
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      const onboardingUrl = err?.response?.data?.data?.onboarding_url;

      if (onboardingUrl) {
        Swal.fire({
          icon: "info",
          title: "Onboarding Required",
          text:
            message || "Please complete the Stripe onboarding process first.",
          confirmButtonColor: "#00AEEF",
          confirmButtonText: "Complete Onboarding",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(onboardingUrl, "_blank");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Something went wrong!",
          confirmButtonColor: "#00AEEF",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe-connection-status"] });
    },
  });
};
