import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useRefereePreviousCampService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    getPreviousCamps: (page = 1) =>
      axiosSecure.get("/v1/referee/camp/previous-camps", {
        params: { page },
      }),
  };
};
