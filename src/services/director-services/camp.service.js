import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useCampService = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  return {
    // Director's camp list (auth required)
    getMyCamps: (page = 1) =>
      axiosSecure.get(`/v1/director/camp/list?page=${page}`),

    // Public — sports types
    getSportsTypes: () => axiosPublic.get("/v1/camp/sports-type"),

    // Auth required — available timezones
    getTimeZones: () => axiosSecure.get("/v1/timezones/available"),

    // Auth required — admin/software fee
    getAdminFee: () => axiosSecure.get("/v1/camp/admin/fee"),

    // Auth required — create a new camp
    createCamp: (formData) =>
      axiosSecure.post("/v1/camp/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    // Auth required — camp details
    getCampDetails: (id) =>
      axiosSecure.get(`/v1/camp/details/${id}`),

    // Auth required — camp edit data (pre-populated)
    getCampEdit: (id) =>
      axiosSecure.get(`/v1/camp/edit/${id}`),

    // Auth required — update a camp
    updateCamp: ({ id, formData }) =>
      axiosSecure.post(`/v1/camp/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    // Auth required — delete a camp
    deleteCamp: (id) =>
      axiosSecure.delete(`/v1/camp/delete/${id}`),

    // Auth required — director's previously ended camps (paginated)
    previousCamp: (page = 1) =>
      axiosSecure.get(`/v1/director/camp/previous-camps?page=${page}`),

    getAllDirectors: (search = "", campId = "") => axiosSecure.get(`/assistant-director/list?search=${search}&camp_id=${campId}`),

    assignAssistantDirector: (data) =>
      axiosSecure.post("/assistant-director-permissions/assign", data),

    assignedCampList: (page = 1) =>
      axiosSecure.get(`/assistant-director/camp/list?page=${page}`),

    removeAssistantDirector: (assistantId, campId) =>
      axiosSecure.delete(`/assistant-director/camp/permission/remove?assistant_director_id=${assistantId}&camp_id=${campId}`),
  };
};
