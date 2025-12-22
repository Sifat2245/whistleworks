import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useRegisteredReferees = (camp_id) => {
  const axiosInstance = useAxiosSecure();

  const { data: getRegisterReferess, isLoading } = useQuery({
    queryKey: ["registered-referees"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/referee/evaluation/camp/${camp_id}/all-checked-in-referees`
      );
      return response?.data?.data?.referees || [];
    },
  });

  return { getRegisterReferess, isLoading };
};
export default useRegisteredReferees;
