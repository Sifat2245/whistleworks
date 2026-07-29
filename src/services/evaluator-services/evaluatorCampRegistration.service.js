import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluatorCampRegistrationService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getMyRegistrations: (page = 1, perPage = 12) =>
      axiosSecure.get("/evaluator/camp-registration/my-registrations", {
        params: { page, per_page: perPage },
      }),

    registerForCamp: (payload) =>
      axiosSecure.post("/evaluator/camp-registration/register", payload),

    cancelRegistration: (registrationId) =>
      axiosSecure.delete(`/evaluator/camp-registration/cancel/${registrationId}`),

    getPreviousCamps: (page = 1) =>
      axiosSecure.get("/evaluator/camp-registration/previous-camps", {
        params: { page },
      }),
  };
};
