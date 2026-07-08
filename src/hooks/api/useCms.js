import { useQuery } from "@tanstack/react-query";
import { useCMSService } from "@/services/cms.service";

export const useHomeCms = () => {
  const { getHomeCms } = useCMSService();

  return useQuery({
    queryKey: ["home-cms"],
    queryFn: async () => {
      const response = await getHomeCms();
      return response?.data?.message;
    },
    staleTime: 30 * 60 * 1000, // 30 min - CMS data rarely changes
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
};

export const useAboutCms = () => {
  const { getAboutCms } = useCMSService();

  return useQuery({
    queryKey: ["about-us"],
    queryFn: async () => {
      const response = await getAboutCms();
      return response?.data?.data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
