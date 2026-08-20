import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useBuildScheduleService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Fetch date range details for a camp */
    getDateRange: (campId) => axiosSecure.get(`/v1/camp/${campId}/date-range`),

    /** Create schedule for a camp */
    createSchedule: (campId, data) => {
      const payload = {
        game_duration: Number(data?.game_duration),
        max_referees_per_slot: Number(data?.max_referees_per_slot),
        time_ranges: (data?.time_ranges || []).map((range) => ({
          date: range.date,
          start_time: range.start_time,
          end_time: range.end_time,
        })),
        locations: (data?.locations || []).map((loc) => ({
          location_name: loc.location_name,
          latitude: String(loc.latitude ?? ""),
          longitude: String(loc.longitude ?? ""),
          court_count: Number(loc.court_count),
          address: loc.address || loc.location_name || "",
        })),
        referee_positions: data?.referee_positions || [],
      };
      return axiosSecure.post(`/v1/camp/${campId}/schedule/create`, payload);
    },

    /** Publish schedule */
    publishSchedule: (campId) =>
      axiosSecure.post(`/v1/camp/${campId}/schedule/publish`),

    /** Clear all assignments for a schedule */
    clearSchedule: (scheduleId) =>
      axiosSecure.delete(
        `/v1/director/court-assign/schedules/${scheduleId}/clear-assignments`,
      ),

    /** Delete entire schedule */
    deleteSchedule: (campId) =>
      axiosSecure.delete(`/v1/camp/${campId}/schedule`),
  };
};
