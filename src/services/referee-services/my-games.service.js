import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereeGamesService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getAssignedSlots: (campId, page = 1) =>
      axiosSecure.get(`/referee/camp/${campId}/assigned-slots`, {
        params: { page },
      }),
  };
};
