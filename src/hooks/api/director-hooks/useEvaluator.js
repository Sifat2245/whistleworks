import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvaluatorService } from "@/services/director-services/evaluator.service";
import toast from "react-hot-toast";

// ── Query key factory ─────────────────────────────────────────
export const evaluatorKeys = {
  all: ["evaluators"],
  camp: (campId) => ["evaluators", campId],
  pending: (campId, page) => ["evaluators", campId, "pending", page],
  approved: (campId, page) => ["evaluators", campId, "approved", page],
  rejected: (campId, page) => ["evaluators", campId, "rejected", page],
};

// ── Pending evaluators (cached, paginated) ────────────────────
export const usePendingEvaluators = (campId, page = 1) => {
  const { getPendingEvaluators } = useEvaluatorService();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: evaluatorKeys.pending(campId, page),
    queryFn: async () => {
      const response = await getPendingEvaluators(campId, page);
      return response?.data?.data || { registrations: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 2 * 60 * 1000,        // 2 min — pending status changes are important
    gcTime: 15 * 60 * 1000,          // keep in cache for 15 min
    placeholderData: (previousData) => previousData,
  });

  return {
    pendingEvaluators: (data?.registrations || []).map((reg) => ({
      id: reg.id,
      image: reg.evaluator?.avatar,
      name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator?.email,
      evaluatorNumber: reg.evaluator?.phone || "",
      isPhoneShow: reg.evaluator?.is_phone_show,
      isAddressShow: reg.evaluator?.is_address_show,
      registeredAt: reg.registered_at,
    })),
    pagination: data?.pagination || {
      total: 0,
      per_page: 12,
      current_page: 1,
      last_page: 1,
    },
    isLoading,
    isFetching,
    isError,
  };
};

// ── Approved evaluators (cached, paginated, client-searchable) ─
export const useApprovedEvaluators = (campId, page = 1, searchQuery = "") => {
  const { getApprovedEvaluators } = useEvaluatorService();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: evaluatorKeys.approved(campId, page),
    queryFn: async () => {
      const response = await getApprovedEvaluators(campId, page);
      return response?.data?.data || { registrations: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,        // 3 min
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  // Transform raw data
  const rawEvaluators = (data?.registrations || []).map((reg) => ({
    id: reg.id,
    image: reg.evaluator?.avatar,
    name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
    evaluatorMail: reg.evaluator?.email,
    evaluatorAddress: reg.evaluator?.address,
    evaluatorNumber: reg.evaluator?.phone,
    isPhoneShow: reg.evaluator?.is_phone_show,
    isAddressShow: reg.evaluator?.is_address_show,
    registeredAt: reg.registered_at,
    approvedAt: reg.approved_at,
  }));

  // Client-side search filter
  const query = searchQuery.trim().toLowerCase();
  const approvedEvaluators = query
    ? rawEvaluators.filter(
        (ev) =>
          ev.name?.toLowerCase().includes(query) ||
          ev.evaluatorMail?.toLowerCase().includes(query) ||
          ev.id.toString().includes(query),
      )
    : rawEvaluators;

  return {
    approvedEvaluators,
    pagination: data?.pagination || {
      total: 0,
      per_page: 12,
      current_page: 1,
      last_page: 1,
    },
    isLoading,
    isFetching,
    isError,
  };
};

// ── Rejected evaluators (cached, paginated) ──────────────────
export const useRejectedEvaluators = (campId, page = 1) => {
  const { getAllRejectedEvaluators } = useEvaluatorService();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: evaluatorKeys.rejected(campId, page),
    queryFn: async () => {
      const response = await getAllRejectedEvaluators(campId, page);
      return response?.data?.data || { registrations: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    rejectedEvaluators: (data?.registrations || []).map((reg) => ({
      id: reg.id,
      image: reg.evaluator?.avatar,
      name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator?.email,
      evaluatorNumber: reg.evaluator?.phone,
      isPhoneShow: reg.evaluator?.is_phone_show,
      registeredAt: reg.registered_at,
      rejectedAt: reg.rejected_at,
      rejectionReason: reg.rejection_reason,
    })),
    pagination: data?.pagination || {
      total: 0,
      per_page: 12,
      current_page: 1,
      last_page: 1,
    },
    isLoading,
    isFetching,
    isError,
  };
};

// ── Approve evaluator (mutation) ──────────────────────────────
export const useApproveEvaluator = (campId) => {
  const { approveEvaluator } = useEvaluatorService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["approve-evaluator", campId],
    mutationFn: approveEvaluator,
    onSuccess: () => {
      toast.success("Evaluator approved successfully!");

      // Invalidate all evaluator queries (pending, approved, rejected) for this camp
      queryClient.invalidateQueries({
        queryKey: campId ? evaluatorKeys.camp(campId) : evaluatorKeys.all,
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve evaluator.",
      );
    },
  });
};

// ── Reject evaluator (mutation) ───────────────────────────────
export const useRejectEvaluator = (campId) => {
  const { rejectEvaluator } = useEvaluatorService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reject-evaluator", campId],
    mutationFn: rejectEvaluator,
    onSuccess: () => {
      toast.success("Evaluator rejected.");

      // Invalidate all evaluator queries (pending, approved, rejected) for this camp
      queryClient.invalidateQueries({
        queryKey: campId ? evaluatorKeys.camp(campId) : evaluatorKeys.all,
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to reject evaluator.",
      );
    },
  });
};

// ── Remove evaluator (mutation) ──────────────────────────────
export const useRemoveEvaluator = (campId) => {
  const { removeEvaluator } = useEvaluatorService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-evaluator", campId],
    mutationFn: removeEvaluator,
    onSuccess: () => {
      toast.success("Evaluator removed successfully.");

      // Invalidate all evaluator queries (pending, approved, rejected) for this camp
      queryClient.invalidateQueries({
        queryKey: campId ? evaluatorKeys.camp(campId) : evaluatorKeys.all,
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove evaluator.",
      );
    },
  });
};
