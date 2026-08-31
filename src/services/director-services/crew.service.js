import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useCrewService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    // Queries

    /** Fetch all crew groups for a camp */
    getCampCrews: (campId) =>
      axiosSecure.get(`/v1/camp/${campId}/crews`),

    /** Fetch single crew details */
    getCrewDetails: (crewId) =>
      axiosSecure.get(`/v1/crew/${crewId}`),

    /** Fetch available referees for a crew (paginated) */
    getAvailableRefereesForCrew: (campId, page = 1) =>
      axiosSecure.get(`/v1/camp/${campId}/available-referees-for-crew`, {
        params: { page },
      }),

    // Mutations

    /** Create a new crew */
    createCrew: (campId, payload) =>
      axiosSecure.post(`/v1/camp/${campId}/crew/create`, payload),

    /** Update an existing crew */
    updateCrew: (crewId, payload) =>
      axiosSecure.post(`/v1/crew/update/${crewId}`, payload),

    /** Add members to an existing crew */
    addMembersToCrew: (crewId, payload) =>
      axiosSecure.post(`/v1/crew/${crewId}/add-members`, payload),

    /** Remove a member from a crew */
    removeMemberFromCrew: (crewId, refereeId) =>
      axiosSecure.delete(`/v1/crew/${crewId}/remove-members`, {
        params: { referee_ids: [refereeId] },
      }),

    /** Delete a crew entirely */
    deleteCrew: (crewId) =>
      axiosSecure.delete(`/v1/crew/delete/${crewId}`),
  };
};
