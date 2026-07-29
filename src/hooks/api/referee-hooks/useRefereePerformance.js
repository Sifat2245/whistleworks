import { useQuery } from "@tanstack/react-query";
import { useRefereePerformanceService } from "@/services/referee-services/referee-performance.service";

// ── Query key factory ─────────────────────────────────────────
export const refereePerformanceKeys = {
  myEvaluations: (campId) => ["referee-performance", campId],
};

// ── My evaluations / performance (cached) ─────────────────────
export const useMyEvaluations = (campId) => {
  const { getMyEvaluations } = useRefereePerformanceService();

  return useQuery({
    queryKey: refereePerformanceKeys.myEvaluations(campId),
    queryFn: async () => {
      const response = await getMyEvaluations(campId);
      return response?.data?.data || {};
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,
  });
};
