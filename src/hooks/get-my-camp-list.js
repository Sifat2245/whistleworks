import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useGetMyCamp = () => {
  const axiosSecure = useAxiosSecure();

  // Note: get all camp
  const { data: getMyCamp, isLoading: campCartLoading } = useQuery({
    queryKey: ["my-campus"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/v1/director/camp/list`);
      return response?.data?.data?.camp_list || [];
    },
  });

  return {
    getMyCamp,
    campCartLoading,
  };
};
