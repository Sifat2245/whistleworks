import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useBuildScheduleService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Fetch date range details for a camp */
    getDateRange: (campId) => axiosSecure.get(`/v1/camp/${campId}/date-range`),

    /** Create schedule for a camp */
    createSchedule: (campId, data) =>
      axiosSecure.post(`/v1/camp/${campId}/schedule/create`, data),

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
