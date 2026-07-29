import { useQuery } from "@tanstack/react-query";
import { useRegisteredRefereesService } from "@/services/registered-referees.service";

// ── Registered referees for evaluation ────────────────────────
export const useRegisteredReferees = (campId, page = 1) => {
  const { getRegisteredReferees } = useRegisteredRefereesService();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["registered-referees", campId, page],
    queryFn: async () => {
      const response = await getRegisteredReferees(campId, page);
      return response?.data?.data || { referees: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    getRegisterReferess: data?.referees || [],
    pagination: data?.pagination || {},
    isLoading,
    isFetching,
  };
};
