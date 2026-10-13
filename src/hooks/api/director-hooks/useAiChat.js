import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAiChatService } from "@/services/director-services/ai-chat.service";

// ── Query Key Factory ──────────────────────────────────────────
export const aiChatKeys = {
  all: ["ai-chat"],
  camps: (params) => ["ai-chat", "camps", params || {}],
  participants: (filters) => ["ai-chat", "participants", filters || {}],
  quota: () => ["ai-chat", "quota"],
  sessions: () => ["ai-chat", "sessions"],
  sessionHistory: (sessionUuid) => ["ai-chat", "session", sessionUuid],
};

// ── Director's AI camps list ────────────────────────────────────
export const useGetAiCamps = (params = {}) => {
  const { getAiCamps } = useAiChatService();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: aiChatKeys.camps(params),
    queryFn: async () => {
      const response = await getAiCamps(params);
      return response?.data || { data: [], pagination: {} };
    },
  });

  const camps = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.camp_list)
      ? data.data.camp_list
      : [];

  return {
    camps,
    pagination: data?.pagination || {},
    isLoading,
    isFetching,
    refetch,
  };
};

// ── Director's AI participants list (infinite scroll) ───────────
export const useGetAiParticipantsInfinite = ({
  role,
  campId,
  search = "",
  enabled = true,
  perPage = 20,
} = {}) => {
  const { getAiParticipants } = useAiChatService();

  const filters = {
    role,
    camp_id: campId && campId !== "all" ? campId : undefined,
    search: search ? search.trim() : undefined,
    per_page: perPage,
  };

  return useInfiniteQuery({
    queryKey: aiChatKeys.participants(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAiParticipants({
        ...filters,
        page: pageParam,
      });
      return response?.data || { data: [], pagination: {} };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination) return undefined;
      const current = Number(pagination.current_page);
      const last = Number(pagination.last_page);
      return current < last ? current + 1 : undefined;
    },
    enabled: Boolean(enabled && role),
    staleTime: 60 * 1000,
  });
};

// ── Convenience hook for AI participants (flattened array) ──────
export const useGetAiParticipants = ({
  role,
  campId,
  search = "",
  enabled = true,
  perPage = 20,
} = {}) => {
  const query = useGetAiParticipantsInfinite({
    role,
    campId,
    search,
    enabled,
    perPage,
  });

  const participants =
    query.data?.pages?.flatMap((page) =>
      Array.isArray(page?.data) ? page.data : [],
    ) || [];

  const total =
    query.data?.pages?.[0]?.pagination?.total ?? participants.length;

  return {
    ...query,
    participants,
    total,
  };
};

// ── Director's AI Quota ─────────────────────────────────────────
export const useGetAiQuota = () => {
  const { getAiQuota } = useAiChatService();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: aiChatKeys.quota(),
    queryFn: async () => {
      const response = await getAiQuota();
      return response?.data?.data || null;
    },
    staleTime: 30 * 1000,
  });

  return {
    quota: data,
    isLoading,
    isError,
    refetch,
  };
};

// ── Send AI Prompt (Mutation) ──────────────────────────────────
export const useSendAiChat = () => {
  const { sendAiChat } = useAiChatService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, session_uuid }) => {
      const response = await sendAiChat({ message, session_uuid });
      if (response?.data?.success === false)
        throw new Error(response.data.message || "Unable to send message.");
      return response?.data || null;
    },
    onSuccess: (res) => {
      if (res?.data?.session_uuid) {
        queryClient.invalidateQueries({
          queryKey: aiChatKeys.sessionHistory(res.data.session_uuid),
        });
      }
      if (res?.data?.quota) {
        queryClient.setQueryData(aiChatKeys.quota(), (old) => ({
          ...old,
          ...res.data.quota,
        }));
      }
    },
    onSettled: () => {
      // A failed generation can still create a session or consume server quota.
      queryClient.invalidateQueries({ queryKey: aiChatKeys.quota() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
    },
  });
};

// ── Retrieve Session History ───────────────────────────────────
export const useGetAiSessionHistory = (sessionUuid, options = {}) => {
  const { getSessionHistory } = useAiChatService();

  return useQuery({
    queryKey: aiChatKeys.sessionHistory(sessionUuid),
    queryFn: async ({ signal }) => {
      if (!sessionUuid) return null;
      const response = await getSessionHistory(sessionUuid, signal);
      if (response?.data?.success === false)
        throw new Error(
          response.data.message || "Unable to load conversation.",
        );
      const data = response?.data?.data;
      if (!data || !Array.isArray(data.messages))
        throw new Error("The server returned an invalid conversation history.");
      return data;
    },
    enabled: Boolean(sessionUuid && options.enabled !== false),
    staleTime: 60 * 1000,
  });
};

export const useGetAiSessions = () => {
  const { getAiSessions } = useAiChatService();
  const query = useInfiniteQuery({
    queryKey: aiChatKeys.sessions(),
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const response = await getAiSessions({ page: pageParam }, signal);
      if (response?.data?.success === false)
        throw new Error(
          response.data.message || "Unable to load conversations.",
        );
      const data = response?.data?.data;
      if (!data || !Array.isArray(data.sessions))
        throw new Error("The server returned an invalid conversation list.");
      return data;
    },
    getNextPageParam: (page) => {
      const current = Number(page?.pagination?.current_page);
      const last = Number(page?.pagination?.last_page);
      return current < last ? current + 1 : undefined;
    },
    staleTime: 30_000,
  });
  const sessions = [
    ...new Map(
      (query.data?.pages || [])
        .flatMap((page) => (Array.isArray(page.sessions) ? page.sessions : []))
        .filter((session) => session?.session_uuid)
        .map((session) => [session.session_uuid, session]),
    ).values(),
  ];
  return { ...query, sessions };
};

export const useRenameAiSession = () => {
  const { renameAiSession } = useAiChatService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await renameAiSession(payload);
      if (response?.data?.success === false)
        throw new Error(
          response.data.message || "Unable to rename conversation.",
        );
      return response?.data;
    },
    onSuccess: (_response, { sessionUuid, title }) => {
      queryClient.setQueryData(aiChatKeys.sessionHistory(sessionUuid), (old) =>
        old ? { ...old, title } : old,
      );
      queryClient.setQueryData(aiChatKeys.sessions(), (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                sessions: (page.sessions || []).map((session) =>
                  session.session_uuid === sessionUuid
                    ? { ...session, title }
                    : session,
                ),
              })),
            }
          : old,
      );
      queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
      queryClient.invalidateQueries({
        queryKey: aiChatKeys.sessionHistory(sessionUuid),
      });
    },
  });
};
