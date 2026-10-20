import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDirectorNoteService } from "@/services/director-services/director-note.service";
import { rosterKeys } from "@/hooks/api/director-hooks/useRosterForDirector";
import toast from "react-hot-toast";

export const useUpdateRefereeNote = (campId) => {
  const { updateRefereeNote } = useDirectorNoteService();
  const queryClient = useQueryClient();
  const CAMP_QUERY_KEY = rosterKeys.campDetails(campId);

  return useMutation({
    mutationKey: ["update-referee-note", campId],
    mutationFn: ({ refereeId, notes }) =>
      updateRefereeNote(campId, refereeId, notes),
    onMutate: async ({ refereeId, notes }) => {
      await queryClient.cancelQueries({ queryKey: CAMP_QUERY_KEY });
      const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

      // Optimistic update
      queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
        if (!old?.referees) return old;
        return {
          ...old,
          referees: old.referees.map((ref) =>
            (ref.id === refereeId || ref.referee_id === refereeId)
              ? { ...ref, notes, note: notes }
              : ref,
          ),
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Note saved successfully");
      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["referee-list"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CAMP_QUERY_KEY, context.previous);
      }
      toast.error(
        error?.response?.data?.data ||
          error?.response?.data?.message ||
          "Failed to save note.",
      );
    },
  });
};

export const useDeleteRefereeNote = (campId) => {
  const { deleteRefereeNote } = useDirectorNoteService();
  const queryClient = useQueryClient();
  const CAMP_QUERY_KEY = rosterKeys.campDetails(campId);

  return useMutation({
    mutationKey: ["delete-referee-note", campId],
    mutationFn: (refereeId) => deleteRefereeNote(campId, refereeId),
    onMutate: async (refereeId) => {
      await queryClient.cancelQueries({ queryKey: CAMP_QUERY_KEY });
      const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

      // Optimistic update
      queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
        if (!old?.referees) return old;
        return {
          ...old,
          referees: old.referees.map((ref) =>
            (ref.id === refereeId || ref.referee_id === refereeId)
              ? { ...ref, notes: null, note: null }
              : ref,
          ),
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Note removed successfully");
      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["referee-list"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CAMP_QUERY_KEY, context.previous);
      }
      toast.error(
        error?.response?.data?.data ||
          error?.response?.data?.message ||
          "Failed to remove note.",
      );
    },
  });
};
