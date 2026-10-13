import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useAiChatService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    // GET /v1/director/ai/camps
    getAiCamps: (params = {}) => {
      const queryParams =
        typeof params === "object"
          ? params
          : params !== undefined
            ? { page: params }
            : undefined;
      return axiosSecure.get("/v1/director/ai/camps", { params: queryParams });
    },

    // GET /v1/director/ai/participants
    getAiParticipants: (params = {}) => {``
      const cleanedParams = {};
      if (params.page !== undefined) cleanedParams.page = params.page;
      if (params.per_page !== undefined)
        cleanedParams.per_page = params.per_page;
      if (params.role) cleanedParams.role = params.role;
      if (params.camp_id && params.camp_id !== "all")
        cleanedParams.camp_id = params.camp_id;
      if (params.search && params.search.trim())
        cleanedParams.search = params.search.trim();

      return axiosSecure.get("/v1/director/ai/participants", {
        params: cleanedParams,
      });
    },

    // GET /v1/director/ai/quota
    getAiQuota: () => axiosSecure.get("/v1/director/ai/quota"),

    // POST /v1/director/ai/chat
    sendAiChat: (payload) => {
      let data = payload;
      if (!(payload instanceof FormData)) {
        const formData = new FormData();
        if (payload?.message !== undefined) {
          formData.append("message", payload.message);
        }
        if (payload?.session_uuid) {
          formData.append("session_uuid", payload.session_uuid);
        }
        data = formData;
      }
      return axiosSecure.post("/v1/director/ai/chat", data);
    },

    // GET /v1/director/ai/session/{session_uuid}/history
    getSessionHistory: (sessionUuid, signal) =>
      axiosSecure.get(
        `/v1/director/ai/session/${encodeURIComponent(sessionUuid)}/history`,
        { signal },
      ),

    getAiSessions: (params = {}, signal) =>
      axiosSecure.get("/v1/director/ai/sessions", { params, signal }),

    renameAiSession: ({ sessionUuid, title }) =>
      axiosSecure.patch(
        `/v1/director/ai/session/rename/${encodeURIComponent(sessionUuid)}`,
        { title },
      ),
  };
};
