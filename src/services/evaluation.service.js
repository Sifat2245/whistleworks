import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluationService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getRegisteredReferees: (campId, page = 1) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/all-referees`, {
        params: { page },
      }),

    getRecommendLevels: (campIdOrParams) => {
      const params = { format: "objects" };
      if (typeof campIdOrParams === "object" && campIdOrParams !== null) {
        Object.assign(params, campIdOrParams);
        if (params.campId && !params.camp_id) {
          params.camp_id = params.campId;
          delete params.campId;
        }
      } else if (campIdOrParams) {
        params.camp_id = campIdOrParams;
      }
      return axiosSecure.get("/referee/evaluation/recommended-highest-level", {
        params,
      });
    },

    storeEvaluation: (formData) =>
      axiosSecure.post("/referee/evaluation/store", formData),

    // Alias for backwards compatibility
    submitEvaluation: (formData) =>
      axiosSecure.post("/referee/evaluation/store", formData),

    updateEvaluation: (evaluationId, formData) =>
      axiosSecure.post(`/referee/evaluation/update/${evaluationId}`, formData),

    deleteEvaluation: (evaluationId) =>
      axiosSecure.delete(`/referee/evaluation/destroy/${evaluationId}`),

    getMyCampEvaluations: (campId, page = 1, params = {}) =>
      axiosSecure.get(`/referee/evaluation/my-evaluations/${campId}`, {
        params: { page, ...params },
      }),

    getEvaluationDetails: (evaluationId) =>
      axiosSecure.get(`/referee/evaluation/details/${evaluationId}`),

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
  };
};

