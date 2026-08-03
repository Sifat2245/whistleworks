import { useQuery } from "@tanstack/react-query";
import { useEvaluatorScheduleService } from "@/services/evaluator-services/evaluator-schedule.service";

// ── Query key factory ─────────────────────────────────────────
export const evaluatorScheduleKeys = {
  campRoster: (campId) => ["evaluator-camp-roster", campId],
  refereeDetails: (campId, refereeId) => [
    "referee-details",
    campId,
    refereeId,
  ],
};

// ── Camp roster details (cached, enabled when campId is set) ──
export const useCampRosterDetails = (campId) => {
  const { getCampRosterDetails } = useEvaluatorScheduleService();

  return useQuery({
    queryKey: evaluatorScheduleKeys.campRoster(campId),
    queryFn: async () => {
      const response = await getCampRosterDetails(campId);
      return response?.data?.data?.camp || {};
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
  });
};

// ── Referee details (cached) ──────────────────────────────────
export const useRefereeDetails = (campId, refereeId) => {
  const { getRefereeDetails } = useEvaluatorScheduleService();

  return useQuery({
    queryKey: evaluatorScheduleKeys.refereeDetails(campId, refereeId),
    queryFn: async () => {
      const response = await getRefereeDetails(campId, refereeId);
      return response?.data?.data || null;
    },
    enabled: !!campId && !!refereeId,
    staleTime: 2 * 60 * 1000,
  });
};
