// src/hooks/useCampSchedule.js
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useCampSchedule = (campId) => {
  const axiosInstance = useAxiosSecure();

  const {
    data: scheduleData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["camp-schedule", campId],
    queryFn: async () => {
      if (!campId) return null;
      const response = await axiosInstance.get(`/v1/camp/${campId}/schedule`);
      return response?.data?.data;
    },
    enabled: !!campId, 
    staleTime: 5 * 60 * 1000,
    retry:1
  });

  return {
    scheduleData,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useCampSchedule;