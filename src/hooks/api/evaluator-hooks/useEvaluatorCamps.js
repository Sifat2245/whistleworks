import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvaluatorCampRegistrationService } from "@/services/evaluator-services/evaluatorCampRegistration.service";
import toast from "react-hot-toast";

// ── Query key factory ─────────────────────────────────────────
export const evaluatorCampKeys = {
  all: ["evaluator-camps"],
  registrations: (page, perPage) => [
    "evaluator-my-registrations",
    page,
    perPage,
  ],
  previousCamps: (page) => ["evaluator-previous-camps", page],
};

// ── My registrations (paginated, cached) ──────────────────────
export const useMyRegistrations = (page = 1, perPage = 12) => {
  const { getMyRegistrations } = useEvaluatorCampRegistrationService();

  const { data, isLoading } = useQuery({
    queryKey: evaluatorCampKeys.registrations(page, perPage),
    queryFn: async () => {
      const response = await getMyRegistrations(page, perPage);
      return response?.data?.data || { registrations: [], pagination: {} };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    registrations: data?.registrations || [],
    pagination: data?.pagination || {},
    isLoading,
  };
};

// ── Register for camp (mutation) ──────────────────────────────
export const useRegisterForCamp = (options) => {
  const { registerForCamp } = useEvaluatorCampRegistrationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["evaluator-register-camp"],
    mutationFn: registerForCamp,
    onSuccess: (response, variables, context) => {
      toast.success(response?.data?.message || "Registration submitted successfully!");
      queryClient.invalidateQueries({ queryKey: evaluatorCampKeys.all });
      queryClient.invalidateQueries({ queryKey: ["evaluator-my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const errorMsg =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// ── Cancel registration (mutation) ────────────────────────────
export const useCancelRegistration = (options) => {
  const { cancelRegistration } = useEvaluatorCampRegistrationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["evaluator-cancel-registration"],
    mutationFn: cancelRegistration,
    onSuccess: (response, variables, context) => {
      toast.success(response?.data?.message || "Registration cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: evaluatorCampKeys.all });
      queryClient.invalidateQueries({ queryKey: ["evaluator-my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel registration.",
      );
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// ── Previous camps (paginated, cached) ────────────────────────
export const useEvaluatorPreviousCamps = (page = 1, options = {}) => {
  const { getPreviousCamps } = useEvaluatorCampRegistrationService();

  const isEnabled = options.enabled !== undefined ? options.enabled : page != null;

  const { data, isLoading, isError } = useQuery({
    queryKey: evaluatorCampKeys.previousCamps(page),
    queryFn: async () => {
      const response = await getPreviousCamps(page);
      return response?.data?.data || { registrations: [], pagination: {} };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    enabled: Boolean(isEnabled),
    ...options,
  });

  return {
    registrations: data?.registrations || [],
    pagination: data?.pagination || {},
    isLoading,
    isError,
  };
};
