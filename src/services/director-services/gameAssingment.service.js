import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useGameAssignmentService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Fetch available dates and locations for a camp */
    getAvailableDates: (campId) =>
      axiosSecure.get(`/v1/camp/${campId}/schedule/game-slots`),

    /** Fetch court info for a specific date */
    getCourtInfo: (campId, date) =>
      axiosSecure.get(
        `/v1/camp/${campId}/schedule/game-slots?date=${date}`,
      ),

    /** Bulk update a court's name across all time slots */
    bulkUpdateCourtNames: (locationId, courtNumber, newCourtName) => {
      const formData = new FormData();
      formData.append("court_number", courtNumber);
      formData.append("new_court_name", newCourtName.trim());
      return axiosSecure.post(
        `/v1/location/${locationId}/courts/bulk-update-names`,
        formData,
      );
    },

    /** Toggle block/unblock a single slot */
    toggleBlockSlot: (slotId) =>
      axiosSecure.patch(`/v1/slot/${slotId}/toggle-block`),

    /** Bulk toggle block/unblock for a time slot */
    bulkToggleBlock: (scheduleId, data) =>
      axiosSecure.post(`/v1/schedule/${scheduleId}/bulk-toggle-block`, data),

    // ── Referee / Crew Assignment (ScheduleAddModal) ─────────────
    /** Fetch available referees for a slot */
    getAvailableReferees: (slotId) =>
      axiosSecure.get(
        `/v1/director/court-assign/slot/${slotId}/available-referees-with-time-check`,
      ),

    /** Fetch available crews for a slot */
    getAvailableCrews: (slotId) =>
      axiosSecure.get(
        `/v1/director/court-assign/slot/${slotId}/available-crew-with-time-check`,
      ),

    /** Assign individual referees to a slot */
    assignReferees: (slotId, formData) =>
      axiosSecure.post(
        `/v1/director/court-assign/slot/${slotId}/assign-individual`,
        formData,
      ),

    /** Assign a crew to a slot */
    assignCrew: (slotId, data) =>
      axiosSecure.post(
        `/v1/director/court-assign/slot/${slotId}/assign-crew`,
        data,
      ),

    /** Remove an assignment (individual or crew) */
    removeAssignment: (assignmentId) =>
      axiosSecure.delete(
        `/v1/director/court-assign/assignment/${assignmentId}/remove`,
      ),

    /** Auto-assign referees for a camp */
    autoAssignReferees: (campId) =>
      axiosSecure.post(
        `/v1/director/court-assign/camp/${campId}/auto-assign`,
      ),

    courtModeChange: (slotId, mode) =>
      axiosSecure.post(`/v1/director/court-assign/slot/${slotId}/switch-mode`, { mode }),

    bulkModeChange: (campId, scheduleId, mode) =>
      axiosSecure.post(`/v1/director/court-assign/camp/${campId}/schedule/${scheduleId}/bulk-switch-mode`, { mode }),
  };
};
