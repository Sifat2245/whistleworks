import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useRefereeEvaluations,
  useRankingSettings,
  useUpdateRankingSettings,
  useRefereeEvaluationHistory,
} from "../useRankings";

const mockGetRefereeEvaluations = vi.fn();
const mockGetRankingSettings = vi.fn();
const mockUpdateRankingSettings = vi.fn();
const mockGetRefereeEvaluationHistory = vi.fn();

vi.mock("@/services/ranking.service", () => ({
  useRankingService: () => ({
    getRefereeEvaluations: mockGetRefereeEvaluations,
    getRankingSettings: mockGetRankingSettings,
    updateRankingSettings: mockUpdateRankingSettings,
    getRefereeEvaluationHistory: mockGetRefereeEvaluationHistory,
  }),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RankingsWrapper";
  return Wrapper;
};

describe("useRankings hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee evaluations for a camp", async () => {
    mockGetRefereeEvaluations.mockResolvedValueOnce({
      data: { data: { evaluations: [{ id: 1, rank: 1, score: 9.8 }] } },
    });

    const { result } = renderHook(() => useRefereeEvaluations(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetRefereeEvaluations).toHaveBeenCalledWith(5);
    expect(result.current.evaluations).toEqual([{ id: 1, rank: 1, score: 9.8 }]);
  });

  it("fetches ranking settings and mutates settings", async () => {
    mockGetRankingSettings.mockResolvedValueOnce({
      data: { data: { show_rankings: true } },
    });
    mockUpdateRankingSettings.mockResolvedValueOnce({
      data: { success: true },
    });

    const { result: settingsHook } = renderHook(() => useRankingSettings(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(settingsHook.current.isSuccess).toBe(true));
    expect(settingsHook.current.data).toEqual({ show_rankings: true });

    const { result: mutateHook } = renderHook(() => useUpdateRankingSettings(5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await mutateHook.current.mutateAsync({ show_rankings: false });
    });

    expect(mockUpdateRankingSettings).toHaveBeenCalledWith({
      campId: 5,
      payload: { show_rankings: false },
    });
  });

  it("fetches referee evaluation history via infinite query", async () => {
    mockGetRefereeEvaluationHistory.mockResolvedValueOnce({
      data: {
        data: {
          evaluations: [{ id: 101, score: 9.5 }],
          pagination: { current_page: 1, last_page: 2 },
        },
      },
    });

    const { result } = renderHook(
      () => useRefereeEvaluationHistory(5, 10, true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetRefereeEvaluationHistory).toHaveBeenCalledWith(5, 10, 1);
    expect(result.current.data.pages[0].evaluations).toHaveLength(1);
  });
});
