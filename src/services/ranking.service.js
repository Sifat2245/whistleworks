import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRankingService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getRefereeEvaluations: (campId) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}`),

    getRankingSettings: (campId) =>
      axiosSecure.get(`/camp/${campId}/ranking-settings`),

    updateRankingSettings: ({ campId, payload }) =>
      axiosSecure.put(`/camp/${campId}/ranking-settings`, payload),

    getRefereeEvaluationHistory: (campId, refereeId, page = 1) =>
      axiosSecure.get(
        `/camp/${campId}/referee/${refereeId}/history?page=${page}`,
      ),

    deleteRefereeEvaluation: ({ campId, refereeId, evaluationId }) =>
      axiosSecure.delete(
        `/camp/${campId}/referee/${refereeId}/evaluation/${evaluationId}`,
      ),
  };
};
