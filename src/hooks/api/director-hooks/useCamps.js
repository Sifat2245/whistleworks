import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCampService } from "@/services/director-services/camp.service";

// ── Query key factory ──────────────────────────────────────────
export const campKeys = {
  all: ["camps"],
  previousCamps: (page) => ["camps", "previous-camps", page],
};

// ── Director's camp list ────────────────────────────────────────
export const useGetMyCamp = (page = 1) => {
  const { getMyCamps } = useCampService();

  const { data, isLoading: campCartLoading } = useQuery({
    queryKey: ["my-camps", page],
    queryFn: async () => {
      const response = await getMyCamps(page);
      return response?.data?.data || { camp_list: [], pagination: {} };
    },
  });

  return {
    camps: data?.camp_list || [],
    pagination: data?.pagination || {},
    campCartLoading,
  };
};

// Sports types (rarely changes) 
export const useGetSportsTypes = () => {
  const { getSportsTypes } = useCampService();

  return useQuery({
    queryKey: ["sports-types"],
    queryFn: async () => {
      const response = await getSportsTypes();
      return response?.data?.data || [];
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data) =>
      data?.map((item) => ({
        label: item.sports_name,
        value: item.id,
        sports_fee: item.sports_fee,
      })) || [],
  });
};

// ── Timezones (never changes) ───────────────────────────────────
export const useGetTimeZones = () => {
  const { getTimeZones } = useCampService();

  return useQuery({
    queryKey: ["timezones"],
    queryFn: async () => {
      const response = await getTimeZones();
      return response?.data?.data?.timezones || [];
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

// ── Admin/software fee ──────────────────────────────────────────
export const useGetAdminFee = () => {
  const { getAdminFee } = useCampService();

  return useQuery({
    queryKey: ["admin-fee"],
    queryFn: async () => {
      const response = await getAdminFee();
      return response?.data?.data?.admin_fee || 0;
    },
  });
};

// ── Create a new camp (mutation) ────────────────────────────────
export const useCreateCamp = (options) => {
  const { createCamp } = useCampService();

  return useMutation({
    mutationKey: ["create-camp"],
    mutationFn: createCamp,
    ...options,
  });
};

// ── Camp details ────────────────────────────────────────────────
export const useGetCampDetails = (id) => {
  const { getCampDetails } = useCampService();

  return useQuery({
    queryKey: ["camp-details", id],
    queryFn: async () => {
      const response = await getCampDetails(id);
      return response?.data?.data || {};
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ── Camp edit data ──────────────────────────────────────────────
export const useGetCampEdit = (id) => {
  const { getCampEdit } = useCampService();

  return useQuery({
    queryKey: ["camp-edit", id],
    queryFn: async () => {
      const response = await getCampEdit(id);
      return response?.data?.data || {};
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ── Update a camp (mutation) ────────────────────────────────────
export const useUpdateCamp = (options) => {
  const { updateCamp } = useCampService();

  return useMutation({
    mutationKey: ["update-camp"],
    mutationFn: updateCamp,
    ...options,
  });
};

// ── Delete a camp (mutation) ────────────────────────────────────
export const useDeleteCamp = (options) => {
  const { deleteCamp } = useCampService();

  return useMutation({
    mutationKey: ["delete-camp"],
    mutationFn: deleteCamp,
    ...options,
  });
};

// ── Director's previously ended camps (paginated, cached) ───────
export const useGetPreviousCamps = (page = 1) => {
  const { previousCamp } = useCampService();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: campKeys.previousCamps(page),
    queryFn: async () => {
      const response = await previousCamp(page);
      return (
        response?.data?.data || { previous_camps: [], pagination: {} }
      );
    },
    staleTime: 5 * 60 * 1000, // 5 min — previous camps rarely change
    gcTime: 30 * 60 * 1000, // keep in cache for 30 min
    placeholderData: (previousData) => previousData, // keep last page while navigating
    refetchOnWindowFocus: false,
    retry: 1,
    // Normalize to the shape the MyCampusCart component (My Camps) expects
    select: (data) => ({
      previous_camps: (data?.previous_camps || []).map((camp) => ({
        camp_id: camp.id,
        camp_name: camp.name || "Untitled Camp",
        camp_logo: camp.logo,
        location: camp.location,
        status: camp.status,
        total_referees: camp.total_referees,
        total_courts: camp.total_courts,
      })),
      pagination: data?.pagination || {},
    }),
  });

  return {
    previousCamps: data?.previous_camps || [],
    pagination: data?.pagination || {},
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

// ── Invalidate previous camps cache (e.g. after a camp completes) ─
export const useInvalidatePreviousCamps = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: campKeys.all });
  };
};

// ── Get all directors for assignment ──────────────────────────────
export const useGetAllDirectors = (search = "", campId = "") => {
  const { getAllDirectors } = useCampService();

  return useQuery({
    queryKey: ["all-directors", search, campId],
    queryFn: async () => {
      const response = await getAllDirectors(search, campId);
      return response?.data?.data || [];
    },
  });
};

// ── Assign Assistant Director ─────────────────────────────────────
export const useAssignAssistantDirector = (options) => {
  const { assignAssistantDirector } = useCampService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["assign-assistant-director"],
    mutationFn: assignAssistantDirector,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      queryClient.invalidateQueries({ queryKey: ["all-directors"] });
      queryClient.refetchQueries({ queryKey: ["camp-details"] });
      queryClient.refetchQueries({ queryKey: ["all-directors"] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
};

// ── Remove Assistant Director ─────────────────────────────────────
export const useRemoveAssistantDirector = (options) => {
  const { removeAssistantDirector } = useCampService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-assistant-director"],
    mutationFn: ({ assistantId, campId }) => removeAssistantDirector(assistantId, campId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["camp-details"] });
      queryClient.invalidateQueries({ queryKey: ["all-directors"] });
      queryClient.refetchQueries({ queryKey: ["camp-details"] });
      queryClient.refetchQueries({ queryKey: ["all-directors"] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
};

// ── Get assigned camps list (camps where this director is an assistant) ─
export const useGetAssignedCamps = (page = 1) => {
  const { assignedCampList } = useCampService();

  return useQuery({
    queryKey: ["assigned-camps", page],
    queryFn: async () => {
      const response = await assignedCampList(page);
      return response?.data?.data || { camp_list: [], pagination: {} };
    },
  });
};


