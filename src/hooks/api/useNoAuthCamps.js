import { useQuery } from "@tanstack/react-query";
import { useNoAuthCampService } from "@/services/noauth-camps.service";

// ── Public camp list with filters ─────────────────────────────
export const usePublicCamps = (filters = {}) => {
  const { getCamps } = useNoAuthCampService();

  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-camps", filters],
    queryFn: async () => {
      const params = {};

      if (filters.sports_type_id)
        params.sports_type_id = filters.sports_type_id;
      if (filters.location?.trim())
        params.location = filters.location.trim();
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.sort) params.sort = filters.sort;
      if (filters.page && filters.page > 1) params.page = filters.page;
      if (filters.per_page) params.per_page = filters.per_page;

      const response = await getCamps(params);
      const rawData = response?.data?.data || {};

      const normalizedCamps = (rawData.camp_list || []).map((camp) => ({
        id: camp.id,
        camp_name: camp.camp_name || "Unnamed Camp",
        camp_logo: camp.camp_logo || null,
        sports_type: camp.sports_type_name || "—",
        location: camp.location || "—",
        start_date: camp.start_date || null,
        end_date: camp.end_date || null,
        price: camp.price ?? "0.00",
        referee_registration_status: camp.status || "completed",
        director: camp.director || {},
      }));

      return {
        camp_list: normalizedCamps,
        pagination: rawData.pagination || {},
      };
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    camps: data.camp_list || [],
    pagination: data.pagination || {},
    isLoading,
    isError,
  };
};

// ── Public camp details (no auth required) ──────────────────
export const usePublicCampDetails = (id) => {
  const { getCampDetails } = useNoAuthCampService();

  return useQuery({
    queryKey: ["public-camp-details", id],
    queryFn: async () => {
      const response = await getCampDetails(id);
      return response?.data?.data;
    },
    enabled: !!id,
  });
};

// ── Sports types ──────────────────────────────────────────────
export const useSportsTypes = () => {
  const { getSportsTypes } = useNoAuthCampService();

  return useQuery({
    queryKey: ["public-sports-types"],
    queryFn: async () => {
      const response = await getSportsTypes();
      return response?.data?.data || [];
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

// ── Locations ─────────────────────────────────────────────────
export const useLocations = () => {
  const { getLocations } = useNoAuthCampService();

  return useQuery({
    queryKey: ["public-locations"],
    queryFn: async () => {
      const response = await getLocations();
      return response?.data?.data?.location_list || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
