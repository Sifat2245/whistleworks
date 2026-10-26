import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereeGamesService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getAssignedSlots: (campId, page = 1, status = "upcoming") =>
      axiosSecure.get(`/referee/camp/${campId}/assigned-slots`, {
        params: { page, status },
      }),
  };
};
