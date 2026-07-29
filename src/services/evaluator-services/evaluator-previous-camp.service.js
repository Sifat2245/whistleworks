import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluatorPreviousCampService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getPreviousCamps: (page = 1) =>
      axiosSecure.get("/evaluator/camp-registration/previous-camps", {
        params: { page },
      }),
  };
};
