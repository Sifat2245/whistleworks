import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluationService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getRegisteredReferees: (campId, page = 1) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/all-referees`, {
        params: { page },
      }),

    submitEvaluation: (formData) =>
      axiosSecure.post("/referee/evaluation/upsert", formData),

    getRefereeEvaluation: (campId, refereeId) =>
      axiosSecure.get(
        `/referee/evaluation/camp/${campId}/referee/${refereeId}`,
      ),

    getCampEvaluations: (campId, page = 1, params = {}) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/all-evaluations`, {
        params: { page, ...params },
      }),

    getRefereeRankings: (campId) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/rankings`),

    getEvaluationStats: (campId) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/stats`),

    deleteEvaluation: (evaluationId) =>
      axiosSecure.delete(`/referee/evaluation/${evaluationId}/delete`),
  };
};
