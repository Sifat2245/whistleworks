import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluatorService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    // Queries
    getPendingEvaluators: (campId, page = 1) =>
      axiosSecure.get(
        `/roster/evaluator-registrations/camp/${campId}/pending`,
        { params: { page } },
      ),

    getApprovedEvaluators: (campId, page = 1) =>
      axiosSecure.get(
        `/roster/evaluator-registrations/camp/${campId}/approved`,
        { params: { page } },
      ),

    // Mutations
    approveEvaluator: (registrationId) =>
      axiosSecure.post(
        `/director/evaluator-registrations/approve/${registrationId}`,
      ),

    rejectEvaluator: (registrationId) =>
      axiosSecure.post(
        `/director/evaluator-registrations/reject/${registrationId}`,
      ),

    removeEvaluator: (registrationId) =>
      axiosSecure.delete(
        `/director/evaluator-registrations/remove/${registrationId}`,
      ),
  };
};
