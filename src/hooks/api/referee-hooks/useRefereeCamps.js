import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRefereeCampService } from "@/services/referee-services/referee-camp.service";
import toast from "react-hot-toast";

// ── Query key factory ─────────────────────────────────────────
export const refereeCampKeys = {
  all: ["referee-camps"],
  checkins: (page, perPage) => ["referee-my-checkins", page, perPage],
  registrations: (page, perPage) => ["referee-my-registrations", page, perPage],
  previousCamps: (page) => ["referee-previous-camps", page],
};

// ── My checkins (paginated, cached) ───────────────────────────
export const useMyCheckins = (page = 1, perPage = 10) => {
  const { getMyCheckins } = useRefereeCampService();

  const { data, isLoading } = useQuery({
    queryKey: refereeCampKeys.checkins(page, perPage),
    queryFn: async () => {
      const response = await getMyCheckins(page, perPage);
      return response?.data?.data || { checked_in: [], pagination: {}, summary: {} };
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    checkedInCamps: data?.checked_in || [],
    pagination: data?.pagination || {},
    summary: data?.summary || {},
    isLoading,
  };
};

// ── My registrations (paginated, cached) ──────────────────────
export const useMyRegistrations = (page = 1, perPage = 10) => {
  const { getMyRegistrations } = useRefereeCampService();

  const { data, isLoading } = useQuery({
    queryKey: refereeCampKeys.registrations(page, perPage),
    queryFn: async () => {
      const response = await getMyRegistrations(page, perPage);
      return response?.data?.data || { registrations: [], pagination: {}, summary: {} };
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    registrations: data?.registrations || [],
    pagination: data?.pagination || {},
    summary: data?.summary || {},
    isLoading,
  };
};

// ── Previous camps (paginated, cached) ────────────────────────
export const useRefereePreviousCamps = (page = 1, options = {}) => {
  const { getPreviousCamps } = useRefereeCampService();

  const isEnabled = options.enabled !== undefined ? options.enabled : page != null;

  const { data, isLoading, isError } = useQuery({
    queryKey: refereeCampKeys.previousCamps(page),
    queryFn: async () => {
      const response = await getPreviousCamps(page);
      return response?.data?.data || { previous_camps: [], pagination: {} };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    enabled: Boolean(isEnabled),
    ...options,
  });

  return {
    previousCamps: data?.previous_camps || [],
    pagination: data?.pagination || {},
    isLoading,
    isError,
  };
};

// ── Check-in mutation ─────────────────────────────────────────
export const useCheckIn = (options) => {
  const { checkIn } = useRefereeCampService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["referee-checkin"],
    mutationFn: checkIn,
    onSuccess: (response, variables, context) => {
      const data = response?.data;
      // If payment is required, redirect to checkout
      if (data?.data?.payment_required && data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
        return;
      }
      toast.success(data?.message || "Checked In Successfully!");
      queryClient.invalidateQueries({ queryKey: refereeCampKeys.all });
      queryClient.invalidateQueries({ queryKey: ["referee-my-checkins"] });
      queryClient.invalidateQueries({ queryKey: ["referee-my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || "Check-in failed. Please try again.",
      );
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// ── Register mutation ─────────────────────────────────────────
export const useRefereeRegister = (options) => {
  const { register } = useRefereeCampService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["referee-register"],
    mutationFn: ({ campId, payload = {} }) => register(campId, payload),
    onSuccess: (response, variables, context) => {
      const data = response?.data;
      if (data?.data?.payment_required && data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
        return;
      }
      toast.success(data?.message || "Registered Successfully!");
      queryClient.invalidateQueries({ queryKey: refereeCampKeys.all });
      queryClient.invalidateQueries({ queryKey: ["referee-my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["referee-my-checkins"] });
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || "Registration failed. Please try again.",
      );
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
