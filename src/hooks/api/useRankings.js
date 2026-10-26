import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRankingService } from "@/services/ranking.service";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const handleRankingError = (error, defaultMsg) => {
  const errorData = error?.response?.data;
  const isForbidden =
    error?.response?.status === 403 || errorData?.code === 403;

  if (isForbidden) {
    const msg = errorData?.data || errorData?.message || defaultMsg;
    Swal.fire({
      icon: "error",
      title: "Permission Denied",
      text: msg,
      confirmButtonColor: "#00AEEF",
    });
    return true;
  }
  return false;
};

// ── Query key factory ───────────────────────────────────────────
export const rankingKeys = {
  all: ["rankings"],
  evaluations: (campId) => ["rankings", "evaluations", campId],
  settings: (campId) => ["rankings", "settings", campId],
  refereeHistory: (campId, refereeId) => [
    "rankings",
    "history",
    campId,
    refereeId,
  ],
};

const EMPTY_EVALUATIONS = [];

// ── Get referee evaluations / rankings for a camp ───────────────
export const useRefereeEvaluations = (campId) => {
  const { getRefereeEvaluations } = useRankingService();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: rankingKeys.evaluations(campId),
    queryFn: async () => {
      const response = await getRefereeEvaluations(campId);
      return response?.data?.data?.evaluations || [];
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,  // 3 min — rankings may shift with new evaluations
    gcTime: 15 * 60 * 1000,    // 15 min cache
  });

  return {
    evaluations: data ?? EMPTY_EVALUATIONS,
    isLoading,
    isError,
    error,
  };
};

// ── Get ranking settings for a camp ─────────────────────────────
export const useRankingSettings = (campId) => {
  const { getRankingSettings } = useRankingService();

  return useQuery({
    queryKey: rankingKeys.settings(campId),
    queryFn: async () => {
      const response = await getRankingSettings(campId);
      return response?.data?.data || {};
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// ── Update ranking settings ────────────────────────────────────
export const useUpdateRankingSettings = (campId, options) => {
  const { updateRankingSettings } = useRankingService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rankings", "update-settings", campId],
    mutationFn: (payload) => updateRankingSettings({ campId, payload }),
    onSuccess: () => {
      // Invalidate settings so fresh data is fetched next time
      queryClient.invalidateQueries({
        queryKey: rankingKeys.settings(campId),
      });
    },
    onError: (error) => {
      if (
        !handleRankingError(
          error,
          "You do not have permission to manage ranking reports for this camp.",
        )
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.data ||
            error?.response?.data?.message ||
            "Failed to save settings",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    },
    ...options,
  });
};

// ── Get referee evaluation history (infinite scroll) ────────────
export const useRefereeEvaluationHistory = (campId, refereeId, enabled) => {
  const { getRefereeEvaluationHistory } = useRankingService();

  return useInfiniteQuery({
    queryKey: rankingKeys.refereeHistory(campId, refereeId),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getRefereeEvaluationHistory(
        campId,
        refereeId,
        pageParam,
      );
      return (
        response?.data?.data ??
        response?.data ?? { evaluations: [], pagination: {} }
      );
    },
    getNextPageParam: (lastPage) => {
      const currentPage =
        lastPage?.pagination?.current_page ?? lastPage?.current_page;
      const lastPageNum =
        lastPage?.pagination?.last_page ?? lastPage?.last_page;
      if (!currentPage || !lastPageNum || currentPage >= lastPageNum) {
        return undefined;
      }
      return currentPage + 1;
    },
    initialPageParam: 1,
    enabled: !!campId && !!refereeId && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ── Delete referee evaluation ──────────────────────────────────
export const useDeleteRefereeEvaluation = (campId, refereeId, options) => {
  const { deleteRefereeEvaluation } = useRankingService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rankings", "delete-evaluation", campId, refereeId],
    mutationFn: (evaluationId) =>
      deleteRefereeEvaluation({ campId, refereeId, evaluationId }),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Evaluation deleted successfully.",
      );
      queryClient.invalidateQueries({
        queryKey: rankingKeys.refereeHistory(campId, refereeId),
      });
      queryClient.invalidateQueries({
        queryKey: rankingKeys.evaluations(campId),
      });
    },
    onError: (error) => {
      if (
        !handleRankingError(
          error,
          "You do not have permission to delete this evaluation.",
        )
      ) {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.data ||
            "Failed to delete evaluation.",
        );
      }
    },
    ...options,
  });
};
