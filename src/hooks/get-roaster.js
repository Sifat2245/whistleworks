import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
const useGetRoaseter = (camp_id) => {
  const axiosInstance = useAxiosSecure();
  const { data: roasterData, isLoading } = useQuery({
    queryKey: ["roaster-data", camp_id],
    queryFn: async () => {
      const respone = await axiosInstance.get(
        `/roster/camp/details/${camp_id}`
      );
      return respone?.data?.data?.camp || {};
    },
  });

  return { roasterData, isLoading };
};
export default useGetRoaseter;