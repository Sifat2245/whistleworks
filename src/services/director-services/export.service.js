import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useExportService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    exportSchedule: (campId) =>
      axiosSecure.get(`/roster/camp/export/${campId}`, {
        responseType: "blob",
      }),
  };
};
