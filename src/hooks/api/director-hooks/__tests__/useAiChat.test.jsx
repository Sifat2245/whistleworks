import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetAiCamps,
  useGetAiParticipants,
  useGetAiParticipantsInfinite,
  useGetAiQuota,
  useSendAiChat,
  useGetAiSessionHistory,
  useGetAiSessions,
  useRenameAiSession,
} from "../useAiChat";

const mockGetAiCamps = vi.fn();
const mockGetAiParticipants = vi.fn();
const mockGetAiQuota = vi.fn();
const mockSendAiChat = vi.fn();
const mockGetSessionHistory = vi.fn();
const mockGetAiSessions = vi.fn();
const mockRenameAiSession = vi.fn();

vi.mock("@/services/director-services/ai-chat.service", () => ({
  useAiChatService: () => ({
    getAiCamps: (...args) => mockGetAiCamps(...args),
    getAiParticipants: (...args) => mockGetAiParticipants(...args),
    getAiQuota: (...args) => mockGetAiQuota(...args),
    sendAiChat: (...args) => mockSendAiChat(...args),
    getSessionHistory: (...args) => mockGetSessionHistory(...args),
    getAiSessions: (...args) => mockGetAiSessions(...args),
    renameAiSession: (...args) => mockRenameAiSession(...args),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("useAiChat hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches AI camps list successfully", async () => {
    mockGetAiCamps.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: 15,
            name: "Training Camp 84",
            logo: "https://example.com/logo.png",
          },
        ],
        pagination: { total: 1, current_page: 1, last_page: 1 },
      },
    });

    const { result } = renderHook(() => useGetAiCamps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.camps).toHaveLength(1);
    expect(result.current.camps[0].name).toBe("Training Camp 84");
  });

  it("fetches AI participants with role and camp_id scope", async () => {
    mockGetAiParticipants.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: 76,
            name: "Referee1 User",
            role: "referee",
            avatar: "avatar.jpg",
          },
        ],
        pagination: { total: 1, current_page: 1, last_page: 1 },
      },
    });

    const { result } = renderHook(
      () =>
        useGetAiParticipants({
          role: "referee",
          campId: 15,
          search: "Referee1",
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetAiParticipants).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "referee",
        camp_id: 15,
        search: "Referee1",
        page: 1,
        per_page: 20,
      }),
    );

    expect(result.current.participants).toHaveLength(1);
    expect(result.current.participants[0].name).toBe("Referee1 User");
  });

  it("omits camp_id when scope is 'all'", async () => {
    mockGetAiParticipants.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: 6,
            name: "Evaluator User",
            role: "evaluator",
            avatar: "avatar.jpg",
          },
        ],
        pagination: { total: 1, current_page: 1, last_page: 1 },
      },
    });

    const { result } = renderHook(
      () =>
        useGetAiParticipants({
          role: "evaluator",
          campId: "all",
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetAiParticipants).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "evaluator",
        camp_id: undefined,
        page: 1,
      }),
    );
    expect(result.current.participants[0].name).toBe("Evaluator User");
  });

  it("supports infinite pagination next page resolution", async () => {
    mockGetAiParticipants
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [{ id: 1, name: "Ref Page 1" }],
          pagination: { total: 2, current_page: 1, last_page: 2 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [{ id: 2, name: "Ref Page 2" }],
          pagination: { total: 2, current_page: 2, last_page: 2 },
        },
      });

    const { result } = renderHook(
      () =>
        useGetAiParticipantsInfinite({
          role: "referee",
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("fetches AI quota details successfully", async () => {
    mockGetAiQuota.mockResolvedValueOnce({
      data: {
        success: true,
        message: "AI Quota details retrieved.",
        data: {
          plan_tier: "free",
          monthly_query_limit: 50,
          queries_used_this_month: 1,
          remaining_queries: 49,
          tokens_used_this_month: 1690,
          quota_resets_at: "2026-11-10T00:00:00+00:00",
          is_blocked: false,
        },
        code: 200,
      },
    });

    const { result } = renderHook(() => useGetAiQuota(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.quota).toEqual({
      plan_tier: "free",
      monthly_query_limit: 50,
      queries_used_this_month: 1,
      remaining_queries: 49,
      tokens_used_this_month: 1690,
      quota_resets_at: "2026-11-10T00:00:00+00:00",
      is_blocked: false,
    });
  });

  it("sends AI chat prompt successfully and invalidates quota", async () => {
    mockSendAiChat.mockResolvedValueOnce({
      data: {
        success: true,
        message: "AI response generated successfully.",
        data: {
          session_uuid: "test-session-123",
          role: "assistant",
          content: "Hello director!",
          quota: {
            remaining_queries: 48,
            monthly_limit: 50,
            queries_used_this_month: 2,
            plan_tier: "free",
          },
        },
      },
    });

    const { result } = renderHook(() => useSendAiChat(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      message: "Test message",
      session_uuid: undefined,
    });

    expect(mockSendAiChat).toHaveBeenCalledWith({
      message: "Test message",
      session_uuid: undefined,
    });
  });

  it("retrieves AI session history successfully", async () => {
    mockGetSessionHistory.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          session_uuid: "sess-abc",
          title: "Session title",
          messages: [{ id: 1, role: "user", content: "Query" }],
        },
      },
    });

    const { result } = renderHook(() => useGetAiSessionHistory("sess-abc"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetSessionHistory).toHaveBeenCalledWith(
      "sess-abc",
      expect.any(AbortSignal),
    );
    expect(result.current.data?.session_uuid).toBe("sess-abc");
    expect(result.current.data?.messages).toHaveLength(1);
  });

  it("retrieves the nested session list and paginates without duplicate UUIDs", async () => {
    mockGetAiSessions.mockImplementation(({ page }) =>
      Promise.resolve({
        data: {
          success: true,
          data: {
            sessions:
              page === 1
                ? [{ session_uuid: "a", title: "First" }]
                : [
                    { session_uuid: "a", title: "Updated" },
                    { session_uuid: "b", title: "Second" },
                  ],
            pagination: { current_page: page, last_page: 2 },
          },
        },
      }),
    );
    const { result } = renderHook(() => useGetAiSessions(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.sessions).toHaveLength(1));
    await result.current.fetchNextPage();
    await waitFor(() => expect(result.current.sessions).toHaveLength(2));
    expect(result.current.sessions[0].title).toBe("Updated");
    expect(result.current.hasNextPage).toBe(false);
  });

  it("renames through the mutation and rejects API failure envelopes", async () => {
    mockRenameAiSession.mockResolvedValueOnce({
      data: { success: true, data: { title: "Renamed" } },
    });
    const { result } = renderHook(() => useRenameAiSession(), {
      wrapper: createWrapper(),
    });
    await result.current.mutateAsync({ sessionUuid: "a", title: "Renamed" });
    expect(mockRenameAiSession).toHaveBeenCalledWith({
      sessionUuid: "a",
      title: "Renamed",
    });
    mockRenameAiSession.mockResolvedValueOnce({
      data: { success: false, message: "Not permitted" },
    });
    await expect(
      result.current.mutateAsync({ sessionUuid: "a", title: "Other" }),
    ).rejects.toThrow("Not permitted");
  });
});
