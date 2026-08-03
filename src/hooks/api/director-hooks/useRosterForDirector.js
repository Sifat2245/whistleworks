import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRosterService } from "@/services/director-services/rosterForDirector.service";
import toast from "react-hot-toast";

// ── Query key factory ──────────────────────────────────────────
export const rosterKeys = {
  all: ["roster"],
  campDetails: (campId) => ["camp-roster-details", campId],
};

// ── Camp Roster Details (includes referees list) ───────────────
export const useCampRosterDetails = (campId) => {
  const { getCampRosterDetails } = useRosterService();

  return useQuery({
    queryKey: rosterKeys.campDetails(campId),
    queryFn: async () => {
      const response = await getCampRosterDetails(campId);
      return response?.data?.data?.camp || null;
    },
    enabled: !!campId,
    staleTime: 2 * 60 * 1000,       // 2 min
    gcTime: 15 * 60 * 1000,         // keep in cache 15 min
    placeholderData: (previousData) => previousData,
  });
};

// ── Check In Referee (mutation with optimistic update) ─────────
export const useCheckInReferee = (campId) => {
  const { checkInReferee } = useRosterService();
  const queryClient = useQueryClient();
  const CAMP_QUERY_KEY = rosterKeys.campDetails(campId);

  return useMutation({
    mutationKey: ["checkin-referee", campId],
    mutationFn: (refereeId) => checkInReferee(campId, refereeId),
    onMutate: async (refereeId) => {
      await queryClient.cancelQueries({ queryKey: CAMP_QUERY_KEY });
      const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

      // Optimistic update
      queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
        if (!old?.referees) return old;
        return {
          ...old,
          referees: old.referees.map((ref) =>
            ref.id === refereeId ? { ...ref, status: "checked_in" } : ref,
          ),
        };
      });

      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Referee checked in successfully");
      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });
    },
    onError: (error, _refereeId, context) => {
      // Rollback optimistic update
      if (context?.previous) {
        queryClient.setQueryData(CAMP_QUERY_KEY, context.previous);
      }
      toast.error(
        error?.response?.data?.message || "Failed to check in referee.",
      );
    },
  });
};

// ── Remove Referee from Roster (mutation with optimistic update) ─
export const useRemoveRefereeFromRoster = (campId) => {
  const { removeReferee } = useRosterService();
  const queryClient = useQueryClient();
  const CAMP_QUERY_KEY = rosterKeys.campDetails(campId);

  return useMutation({
    mutationKey: ["remove-referee", campId],
    mutationFn: (refereeId) => removeReferee(campId, refereeId),
    onMutate: async (refereeId) => {
      await queryClient.cancelQueries({ queryKey: CAMP_QUERY_KEY });
      const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

      // Optimistic removal
      queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
        if (!old?.referees) return old;
        return {
          ...old,
          referees: old.referees.filter((ref) => ref.id !== refereeId),
        };
      });

      return { previous };
    },
    onSuccess: () => {
      toast.success("Referee removed from roster successfully.");
      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });
    },
    onError: (error, _refereeId, context) => {
      // Rollback optimistic update
      if (context?.previous) {
        queryClient.setQueryData(CAMP_QUERY_KEY, context.previous);
      }
      toast.error(
        error?.response?.data?.message || "Failed to remove referee.",
      );
    },
  });
};

// ── Update Jersey Number (mutation with optimistic update) ─────
export const useUpdateJerseyNumber = (campId) => {
  const { updateJerseyNumber } = useRosterService();
  const queryClient = useQueryClient();
  const CAMP_QUERY_KEY = rosterKeys.campDetails(campId);

  return useMutation({
    mutationKey: ["update-jersey", campId],
    mutationFn: ({ refereeId, jourcyNumber }) =>
      updateJerseyNumber(campId, refereeId, jourcyNumber),
    onMutate: async ({ refereeId, jourcyNumber }) => {
      await queryClient.cancelQueries({ queryKey: CAMP_QUERY_KEY });
      const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

      // Optimistic update
      queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
        if (!old?.referees) return old;
        return {
          ...old,
          referees: old.referees.map((ref) =>
            ref.id === refereeId
              ? { ...ref, jourcy_number: jourcyNumber }
              : ref,
          ),
        };
      });

      return { previous };
    },
    onSuccess: () => {
      toast.success("Jersey number updated successfully.");
      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });
    },
    onError: (error, _variables, context) => {
      // Rollback optimistic update
      if (context?.previous) {
        queryClient.setQueryData(CAMP_QUERY_KEY, context.previous);
      }
      toast.error(
        error?.response?.data?.data || "Failed to update jersey number.",
      );
    },
  });
};
