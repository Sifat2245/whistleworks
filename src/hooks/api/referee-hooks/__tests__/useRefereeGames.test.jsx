import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAssignedSlots } from "../useRefereeGames";

const mockGetAssignedSlots = vi.fn();

vi.mock("@/services/referee-services/my-games.service", () => ({
  useRefereeGamesService: () => ({
    getAssignedSlots: mockGetAssignedSlots,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    // Exercise the hook's retry policy without waiting for backoff in tests.
    defaultOptions: { queries: { retryDelay: 0 } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RefereeGamesWrapper";
  return Wrapper;
};

describe("useRefereeGames hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches assigned slots when campId is provided", async () => {
    const mockData = {
      game_slots: [{ id: 1, court: "Court 1" }],
      pagination: { total: 1, current_page: 1 },
      statistics: { total_games: 1 },
      camp: { name: "Pro Camp" },
    };
    mockGetAssignedSlots.mockResolvedValueOnce({
      data: { data: mockData },
    });

    const { result } = renderHook(() => useAssignedSlots(12, 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetAssignedSlots).toHaveBeenCalledWith(12, 1, "upcoming");
    expect(result.current.gameSlots).toEqual(mockData.game_slots);
    expect(result.current.camp).toEqual(mockData.camp);
  });

  it("does not fetch assigned slots if campId is missing", () => {
    const { result } = renderHook(() => useAssignedSlots(null), {
      wrapper: createWrapper(),
    });

    expect(mockGetAssignedSlots).not.toHaveBeenCalled();
    expect(result.current.gameSlots).toEqual([]);
  });

  it.each([401, 403, 404, 422])(
    "stops after the first HTTP %s response",
    async (status) => {
      const error = Object.assign(new Error("Request rejected"), {
        response: { status },
      });
      mockGetAssignedSlots.mockRejectedValue(error);

      const { result } = renderHook(() => useAssignedSlots(12), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(mockGetAssignedSlots).toHaveBeenCalledTimes(1);
    },
  );

  it.each([408, 429, 500, undefined])(
    "can recover from a temporary failure (HTTP %s)",
    async (status) => {
      const error = Object.assign(new Error("Temporary failure"), {
        response: status ? { status } : undefined,
      });
      mockGetAssignedSlots.mockRejectedValueOnce(error).mockResolvedValueOnce({
        data: { data: { game_slots: [{ game_slot_id: 42 }] } },
      });

      const { result } = renderHook(() => useAssignedSlots(12), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(result.current.gameSlots).toEqual([{ game_slot_id: 42 }]),
      );
      expect(result.current.isError).toBe(false);
      expect(mockGetAssignedSlots).toHaveBeenCalledTimes(2);
    },
  );

  it("stops after three retries when the server remains unavailable", async () => {
    mockGetAssignedSlots.mockRejectedValue(
      Object.assign(new Error("Unavailable"), { response: { status: 503 } }),
    );

    const { result } = renderHook(() => useAssignedSlots(12), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(4);
  });

  it("never uses games from a different status or camp as placeholder data", async () => {
    const upcomingGame = { game_slot_id: 1 };
    mockGetAssignedSlots.mockImplementation((campId, _page, status) =>
      campId === 12 && status === "upcoming"
        ? Promise.resolve({ data: { data: { game_slots: [upcomingGame] } } })
        : new Promise(() => {}),
    );
    const { result, rerender } = renderHook(
      ({ campId, status }) => useAssignedSlots(campId, 1, status),
      {
        initialProps: { campId: 12, status: "upcoming" },
        wrapper: createWrapper(),
      },
    );

    await waitFor(() =>
      expect(result.current.gameSlots).toEqual([upcomingGame]),
    );
    rerender({ campId: 12, status: "past" });
    expect(result.current.gameSlots).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isPlaceholderData).toBe(false);
    rerender({ campId: 13, status: "upcoming" });
    expect(result.current.gameSlots).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("keeps cached categories separate when switching back", async () => {
    mockGetAssignedSlots.mockImplementation((_campId, _page, status) =>
      Promise.resolve({
        data: { data: { game_slots: [{ game_slot_id: status }] } },
      }),
    );
    const { result, rerender } = renderHook(
      ({ status }) => useAssignedSlots(12, 1, status),
      { initialProps: { status: "upcoming" }, wrapper: createWrapper() },
    );
    await waitFor(() =>
      expect(result.current.gameSlots[0]?.game_slot_id).toBe("upcoming"),
    );
    rerender({ status: "past" });
    await waitFor(() =>
      expect(result.current.gameSlots[0]?.game_slot_id).toBe("past"),
    );
    rerender({ status: "upcoming" });
    expect(result.current.gameSlots[0]?.game_slot_id).toBe("upcoming");
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(2);
  });
});
