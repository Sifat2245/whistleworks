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
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RefereeGamesWrapper";
  return Wrapper;
};

describe("useRefereeGames hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(mockGetAssignedSlots).toHaveBeenCalledWith(12, 1);
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
});
