import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereeCampService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    // Queries
    getMyCheckins: (page = 1, perPage = 10) =>
      axiosSecure.get("/v1/referee/camp/my-checkins", {
        params: { page, per_page: perPage },
      }),

    getMyRegistrations: (page = 1, perPage = 10) =>
      axiosSecure.get("/v1/referee/camp/my-registrations", {
        params: { page, per_page: perPage },
      }),

    getPreviousCamps: (page = 1) =>
      axiosSecure.get("/v1/referee/camp/previous-camps", {
        params: { page },
      }),

    // Mutations
    checkIn: (campId) =>
      axiosSecure.post(`/v1/referee/camp/${campId}/checkin`),

    register: (campId, payload = {}) =>
      axiosSecure.post(`/v2/referee/camp/${campId}/register`, payload),
  };
};
