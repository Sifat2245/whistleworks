import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRosterService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    // Queries

    getCampRosterDetails: (campId) =>
      axiosSecure.get(`/roster/camp/details/${campId}`),

    //  Mutations
    checkInReferee: (campId, refereeId) =>
      axiosSecure.put(
        `/v1/director/camp/${campId}/referee/${refereeId}/manual-checkin`,
      ),

    /** Remove a referee from the camp roster */
    removeReferee: (campId, refereeId) =>
      axiosSecure.delete(`/v1/director/camps/${campId}/referees/${refereeId}`),

    /** Update referee jersey number */
    updateJerseyNumber: (campId, refereeId, jourcyNumber) =>
      axiosSecure.patch(
        `/v1/director/camp/${campId}/referee/${refereeId}/update-jourcy-number`,
        null,
        { params: { jourcy_number: jourcyNumber } },
      ),
  };
};
