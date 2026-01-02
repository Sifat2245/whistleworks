// hooks/useCamps.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useCamps = (filters = {}) => {
  const axiosInstance = useAxiosSecure();

  const buildParams = () => {
    const params = new URLSearchParams();

    if (filters.sports_type_id)
      params.append("sports_type_id", filters.sports_type_id);
    if (filters.location?.trim())
      params.append("location", filters.location.trim());
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page && filters.page > 1) params.append("page", filters.page);
    if (filters.per_page) params.append("per_page", filters.per_page);

    return params.toString();
  };

  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camps", filters],
    queryFn: async () => {
      const paramsString = buildParams();
      const url = paramsString
        ? `/v1/camp/list?${paramsString}`
        : "/v1/camp/list";
      const res = await axiosInstance.get(url);
      return res?.data?.data || {}; // Return full data object
    },
    keepPreviousData: true,
  });

  return {
    camps: data.camp_list || [],
    pagination: data.pagination || {},
    isLoading,
    isError,
  };
};
