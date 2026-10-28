import { useQuery } from "@tanstack/react-query";
import { useRefereePerformanceService } from "@/services/referee-services/referee-performance.service";

// ── Query key factory ─────────────────────────────────────────
export const refereePerformanceKeys = {
  myEvaluations: (campId) => ["referee-performance", campId],
  evaluationDetails: (evaluationId) => [
    "referee-evaluation-details",
    evaluationId,
  ],
};

export const useMyEvaluationDetails = (
  evaluationId,
  { enabled = true } = {},
) => {
  const { getMyEvaluationDetails } = useRefereePerformanceService();

  return useQuery({
    queryKey: refereePerformanceKeys.evaluationDetails(evaluationId),
    queryFn: async () => {
      const response = await getMyEvaluationDetails(evaluationId);
      const body = response?.data;
      if (body?.success === false || body?.status === false || !body?.data) {
        const error = new Error(
          body?.message || "Evaluation details are not available.",
        );
        error.response = {
          status: Number(body?.code) || response?.status,
          data: body,
        };
        throw error;
      }
      return body.data;
    },
    enabled: enabled && evaluationId != null,
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status >= 400 && status < 500 && status !== 408 && status !== 429)
        return false;
      return failureCount < 3;
    },
  });
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
