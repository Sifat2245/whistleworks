import { useQuery } from "@tanstack/react-query";
import { useRefereeGamesService } from "@/services/referee-services/my-games.service";

// ── Query key factory ─────────────────────────────────────────
export const refereeGameKeys = {
  assignedSlots: (campId, page) => ["referee-assigned-slots", campId, page],
};

// ── Assigned game slots (paginated, cached) ───────────────────
export const useAssignedSlots = (campId, page = 1) => {
  const { getAssignedSlots } = useRefereeGamesService();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: refereeGameKeys.assignedSlots(campId, page),
    queryFn: async () => {
      const response = await getAssignedSlots(campId, page);
      return response?.data?.data || {};
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    gameSlots: data?.game_slots || [],
    pagination: data?.pagination || {},
    statistics: data?.statistics || {},
    camp: data?.camp || {},
    isLoading,
    isError,
    error,
  };
};
