// hooks/get-my-camp-list.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useGetMyCamp = (page = 1) => {
  const axiosSecure = useAxiosSecure();

  const { 
    data, 
    isLoading: campCartLoading 
  } = useQuery({
    queryKey: ["my-camps", page], // Removed perPage from key since it's ignored
    queryFn: async () => {
      const response = await axiosSecure.get(`/v1/director/camp/list?page=${page}`);
      return response?.data?.data || { camp_list: [], pagination: {} };
    },
    keepPreviousData: true,
  });

  return {
    camps: data?.camp_list || [],
    pagination: data?.pagination || {},
    campCartLoading,
  };
};