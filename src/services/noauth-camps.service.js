import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useNoAuthCampService = () => {
  const axiosPublic = useAxiosPublic();

  return {
    // ── Public camp list (with filters) ─────────────────────────
    getCamps: (params = {}) =>
      axiosPublic.get("/v1/camp/list", { params }),

    // ── Public camp details (no auth) ───────────────────────────
    getCampDetails: (id) =>
      axiosPublic.get(`/no-auth/camp/details/${id}`),

    // ── Sports types ────────────────────────────────────────────
    getSportsTypes: () =>
      axiosPublic.get("/v1/camp/sports-type"),

    // ── Locations ───────────────────────────────────────────────
    getLocations: () =>
      axiosPublic.get("/v1/camp/locations"),
  };
};
