import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRankingService } from "@/services/ranking.service";
import Swal from "sweetalert2";

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
    evaluations: data || [],
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to save settings",
        timer: 3000,
        showConfirmButton: false,
      });
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
      return response?.data?.data || { evaluations: [], pagination: {} };
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination || pagination.current_page >= pagination.last_page) {
        return undefined;
      }
      return pagination.current_page + 1;
    },
    initialPageParam: 1,
    enabled: !!campId && !!refereeId && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
