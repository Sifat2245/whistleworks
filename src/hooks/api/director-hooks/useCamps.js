import { useQuery, useMutation } from "@tanstack/react-query";
import { useCampService } from "@/services/director-services/camp.service";

// ── Director's camp list ────────────────────────────────────────
export const useGetMyCamp = (page = 1) => {
  const { getMyCamps } = useCampService();

  const { data, isLoading: campCartLoading } = useQuery({
    queryKey: ["my-camps", page],
    queryFn: async () => {
      const response = await getMyCamps(page);
      return response?.data?.data || { camp_list: [], pagination: {} };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  return {
    camps: data?.camp_list || [],
    pagination: data?.pagination || {},
    campCartLoading,
  };
};

// ── Sports types (rarely changes) ───────────────────────────────
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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
