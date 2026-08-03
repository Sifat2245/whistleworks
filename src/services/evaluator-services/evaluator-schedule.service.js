import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluatorScheduleService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getCampRosterDetails: (campId) =>
      axiosSecure.get(`/roster/camp/details/${campId}`),

    getRefereeDetails: (campId, refereeId) =>
      axiosSecure.get(`/referee-details/${campId}/${refereeId}`),
  };
};
