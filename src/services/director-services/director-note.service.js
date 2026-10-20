import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useDirectorNoteService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /**
     * Update/Add note for a referee in a camp
     * PUT /v1/director/camp/{campId}/referee/{refereeId}/update-note
     * Payload: { notes: string }
     */
    updateRefereeNote: (campId, refereeId, notes) =>
      axiosSecure.patch(
        `/v1/director/camp/${campId}/referee/${refereeId}/update-note`,
        { notes },
      ),

    /**
     * Delete note for a referee in a camp
     * DELETE /v1/director/camp/{campId}/referee/{refereeId}/note
     */
    deleteRefereeNote: (campId, refereeId) =>
      axiosSecure.delete(
        `/v1/director/camp/${campId}/referee/${refereeId}/note`,
      ),
  };
};
