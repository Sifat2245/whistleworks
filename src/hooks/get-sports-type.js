import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export const useGetSportsType = () => {
  const axiosPublic = useAxiosPublic();

  const { data: getSportsType } = useQuery({
    queryKey: ["sports-type"],
    queryFn: async () => {
      const response = await axiosPublic.get(`/v1/camp/sports-type`);
      return response?.data?.data || [];
    },
  });

  return { getSportsType };
};



