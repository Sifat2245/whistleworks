import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereePerformanceService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getMyEvaluations: (campId) =>
      axiosSecure.get(`/referee/my-evaluations/${campId}`),
    getMyEvaluationDetails: (evaluationId) =>
      axiosSecure.get(`/referee/my-evaluations/details/${evaluationId}`),
  };
};
