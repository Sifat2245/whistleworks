import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useMyCheckedInGamesService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getMyCheckins: (page = 1, perPage = 10) =>
      axiosSecure.get("/v1/referee/camp/my-checkins", {
        params: { page, per_page: perPage },
      }),
  };
};
