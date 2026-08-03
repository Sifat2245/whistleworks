import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCrewService } from "@/services/director-services/crew.service";
import toast from "react-hot-toast";

// Query key factory
export const crewKeys = {
  all: ["crew"],
  campCrews: (campId) => ["crew-groups", campId],
  details: (crewId) => ["crew", crewId],
  availableReferees: (campId, crewId) => [
    "available-referees-for-crew",
    campId,
    crewId,
  ],
};

// Camp Crews (list all crews for a camp)
export const useCampCrews = (campId) => {
  const { getCampCrews } = useCrewService();

  const { data, isLoading, isError } = useQuery({
    queryKey: crewKeys.campCrews(campId),
    queryFn: async () => {
      const res = await getCampCrews(campId);
      return res?.data?.data || { crews: [] };
    },
    enabled: !!campId,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    crewGroups: data?.crews || [],
    isLoading,
    isError,
  };
};

// Crew Details (single crew)
export const useCrewDetails = (crewId) => {
  const { getCrewDetails } = useCrewService();

  const { data: crewDetails, isLoading, isError } = useQuery({
    queryKey: crewKeys.details(crewId),
    queryFn: async () => {
      const response = await getCrewDetails(crewId);
      return response?.data?.data || null;
    },
    enabled: !!crewId,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return { crewDetails, isLoading, isError };
};

// Available Referees for Crew (infinite scroll)
export const useAvailableRefereesForCrew = (campId, crewId, enabled = true) => {
  const { getAvailableRefereesForCrew } = useCrewService();

  return useInfiniteQuery({
    queryKey: crewKeys.availableReferees(campId, crewId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAvailableRefereesForCrew(campId, pageParam);
      return res?.data?.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const current = Number(lastPage.pagination.current_page);
      const total = Number(lastPage.pagination.last_page);
      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!campId && !!crewId && enabled,
    retry: 1,
  });
};

// Create Crew (mutation)
export const useCreateCrew = (campId) => {
  const { createCrew } = useCrewService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-crew", campId],
    mutationFn: (payload) => createCrew(campId, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Crew created successfully!");
      queryClient.invalidateQueries({
        queryKey: crewKeys.campCrews(campId),
      });
    },
    onError: (error) => {
      const errData = error?.response?.data;
      const errorMessage =
        errData?.message || errData?.data || "Failed to create crew.";
      toast.error(errorMessage);
    },
  });
};

// Add Members to Crew (mutation)
export const useAddMembersToCrew = (crewId, campId) => {
  const { addMembersToCrew } = useCrewService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-members", crewId],
    mutationFn: (payload) => addMembersToCrew(crewId, payload),
    onSuccess: (response) => {
      toast.success(response?.message || "Members added successfully!");
      queryClient.invalidateQueries({
        queryKey: crewKeys.details(crewId),
      });
      queryClient.invalidateQueries({
        queryKey: crewKeys.availableReferees(campId, crewId),
      });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to add members.",
      );
    },
  });
};

// Remove Member from Crew (mutation with optimistic update)
export const useRemoveMemberFromCrew = (crewId) => {
  const { removeMemberFromCrew } = useCrewService();
  const queryClient = useQueryClient();
  const CREW_QUERY_KEY = crewKeys.details(crewId);

  return useMutation({
    mutationKey: ["remove-member", crewId],
    mutationFn: (refereeId) => removeMemberFromCrew(crewId, refereeId),
    onMutate: async (refereeId) => {
      await queryClient.cancelQueries({ queryKey: CREW_QUERY_KEY });
      const previousCrew = queryClient.getQueryData(CREW_QUERY_KEY);

      // Optimistic removal
      queryClient.setQueryData(CREW_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          members: old.members?.filter((m) => m.id !== refereeId) || [],
          member_count: (old.member_count || 1) - 1,
        };
      });

      return { previousCrew };
    },
    onSuccess: () => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: CREW_QUERY_KEY });
    },
    onError: (err, _refereeId, context) => {
      // Rollback optimistic update
      if (context?.previousCrew) {
        queryClient.setQueryData(CREW_QUERY_KEY, context.previousCrew);
      }
      toast.error(
        err?.response?.data?.message || "Failed to remove member",
      );
    },
  });
};

// Delete Crew (mutation)
export const useDeleteCrew = () => {
  const { deleteCrew } = useCrewService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-crew"],
    mutationFn: ({ crewId }) => deleteCrew(crewId),
    onSuccess: (_data, variables) => {
      toast.success("Crew deleted successfully");

      // Invalidate all crew queries
      queryClient.invalidateQueries({
        queryKey: crewKeys.all,
        refetchType: "active",
      });

      // Also invalidate the camp-specific crew list so the
      // ActiveCrews page refreshes automatically
      if (variables?.campId) {
        queryClient.invalidateQueries({
          queryKey: crewKeys.campCrews(variables.campId),
        });
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete crew",
      );
    },
  });
};
