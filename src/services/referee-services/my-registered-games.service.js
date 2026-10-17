import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useMyRegisteredGamesService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getMyRegistrations: (page = 1, perPage = 10) =>
      axiosSecure.get("/v1/referee/camp/my-registrations", {
        params: { page, per_page: perPage },
      }),
  };
};
