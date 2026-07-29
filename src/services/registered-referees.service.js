import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRegisteredRefereesService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Fetch registered referees for a camp (evaluation purpose) */
    getRegisteredReferees: (campId, page = 1) =>
      axiosSecure.get(`/referee/evaluation/camp/${campId}/all-referees`, {
        params: { page },
      }),
  };
};
