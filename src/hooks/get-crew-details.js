import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useGetCrewDetails = (crewId) => {
  const axiosInstance = useAxiosSecure();

  const { data: crewDetails, isLoading, isError, error } = useQuery({
    queryKey: ["crew", crewId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/crew/${crewId}`);
      return response?.data?.data;
    },
    enabled: !!crewId,
  });

  return { crewDetails, isLoading, isError, error };
};

export default useGetCrewDetails;
