import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useGetCampDetails = ({ camp_id }) => {
  const axiosInstance = useAxiosSecure();

  const { data: campDetails, isLoading } = useQuery({
    queryKey: ["camp-details", camp_id], // ✅ FIXED: Include camp_id for unique cache
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/roster/camp/details/${camp_id}`
      );
      return response?.data?.data?.camp || {};
    },
    enabled: !!camp_id, // ✅ Only run if camp_id exists
  });

  return { campDetails, isLoading };
};

export default useGetCampDetails;