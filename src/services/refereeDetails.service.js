import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereeDetailsService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Fetch referee details */
    getRefereeDetails: (campId, refereeId) =>
      axiosSecure.get(`/referee-details/${campId}/${refereeId}`),
  };
};
