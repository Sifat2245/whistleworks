import { useQuery } from "@tanstack/react-query";
import { useRefereeGamesService } from "@/services/referee-services/my-games.service";

// ── Query key factory ─────────────────────────────────────────
export const refereeGameKeys = {
  assignedSlots: (campId, page = 1, status = "upcoming") => [
    "referee-assigned-slots",
    campId,
    status,
    page,
  ],
};

// ── Assigned game slots (paginated, cached) ───────────────────
export const useAssignedSlots = (campId, page = 1, status = "upcoming") => {
  const { getAssignedSlots } = useRefereeGamesService();

  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: refereeGameKeys.assignedSlots(campId, page, status),
    queryFn: async () => {
      const response = await getAssignedSlots(campId, page, status);
      const body = response?.data;

      // Some API failures arrive as HTTP 200 with an error code in the body.
      if (body?.status === false || body?.success === false) {
        const error = new Error(
          body.message || "Unable to load assigned games.",
        );
        error.response = {
          status: Number(body.code) || response.status,
          data: body,
        };
        throw error;
      }

      return response?.data?.data || {};
    },
    enabled: !!campId,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      // Retrying cannot publish a schedule or fix a permission error.
      if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 3 * 60 * 1000,
    // Keep pagination smooth, but never carry games across camps or statuses.
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === campId &&
      previousQuery?.queryKey[2] === status
        ? previousData
        : undefined,
  });

  return {
    gameSlots: data?.game_slots || [],
    pagination: data?.pagination || {},
    statistics: data?.statistics,
    camp: data?.camp || {},
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  };
};
