import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useRegisteredReferees = (camp_id, page = 1) => {
  const axiosInstance = useAxiosSecure();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["registered-referees", camp_id, page],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/referee/evaluation/camp/${camp_id}/all-referees`,
        {
          params: { page },
        }
      );
      return response?.data?.data;
    },
    enabled: !!camp_id,
    keepPreviousData: true,
  });

  return {
    getRegisterReferess: data?.referees || [],
    pagination: data?.pagination || {},
    isLoading,
    isFetching,
  };
};
export default useRegisteredReferees;
