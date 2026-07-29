import { useQuery } from "@tanstack/react-query";
import { useRefereeDetailsService } from "@/services/refereeDetails.service";

// ── Referee details ─────────────────────────────────────────────
export const useGetRefereeDetails = (campId, refereeId) => {
  const { getRefereeDetails } = useRefereeDetailsService();

  const { data: refereeDetails, isLoading } = useQuery({
    queryKey: ["referee-details", campId, refereeId],
    queryFn: async () => {
      const response = await getRefereeDetails(campId, refereeId);
      return response?.data?.data;
    },
    enabled: !!campId && !!refereeId,
  });

  return { refereeDetails, isLoading };
};
