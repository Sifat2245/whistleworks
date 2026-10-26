import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useEvaluatorScheduleService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getCampRosterDetails: (campId) =>
      axiosSecure.get(`/roster/camp/details/${campId}`),

    getRefereeDetails: (campId, refereeId) =>
      axiosSecure.get(`/referee-details/${campId}/${refereeId}`),

    // Creating a note identifies the camp and game slot; updates identify the note in the URL.
    createEvaluationNote: (payload) =>
      axiosSecure.post("/referee/evaluation/note/store", payload),

    updateEvaluationNote: (noteId, { note }) =>
      axiosSecure.post(`/referee/evaluation/note/update/${noteId}`, { note }),

    deleteEvaluationNote: (noteId) =>
      axiosSecure.delete(`/referee/evaluation/note/destroy/${noteId}`),
  };
};
