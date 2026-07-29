import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useAnnouncementService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    /** Send an announcement to camp members */
    sendAnnouncement: (payload) =>
      axiosSecure.post("/director/announcement/store", payload),
  };
};
