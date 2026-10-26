import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEvaluatorScheduleService } from "@/services/evaluator-services/evaluator-schedule.service";

// ── Query key factory ─────────────────────────────────────────
export const evaluatorScheduleKeys = {
  campRoster: (campId) => ["evaluator-camp-roster", campId],
  refereeDetails: (campId, refereeId) => ["referee-details", campId, refereeId],
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

const checkNoteResponse = (response) => {
  if (response?.data?.success === false)
    throw new Error(response.data.message || "Unable to change this note.");
  return response;
};

const useEvaluationNoteMutation = (campId, action) => {
  const service = useEvaluatorScheduleService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["evaluator-game-note", action, campId],
    mutationFn: async ({ gameSlotId, noteId, note }) => {
      const payload = { camp_id: campId, note, game_slot_id: gameSlotId };
      const response =
        action === "create"
          ? await service.createEvaluationNote(payload)
          : action === "update"
            ? await service.updateEvaluationNote(noteId, { note })
            : await service.deleteEvaluationNote(noteId);
      return checkNoteResponse(response);
    },
    onSuccess: (response) => {
      toast.success(
        response?.data?.message ||
          (action === "delete"
            ? "Evaluator note deleted."
            : "Evaluator note saved."),
      );
      return queryClient.invalidateQueries({
        queryKey: evaluatorScheduleKeys.campRoster(campId),
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change this note. Please try again.",
      );
    },
  });
};

export const useCreateEvaluationNote = (campId) =>
  useEvaluationNoteMutation(campId, "create");
export const useUpdateEvaluationNote = (campId) =>
  useEvaluationNoteMutation(campId, "update");
export const useDeleteEvaluationNote = (campId) =>
  useEvaluationNoteMutation(campId, "delete");
