import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMyEvaluations } from "../useRefereePerformance";

const mockGetMyEvaluations = vi.fn();

vi.mock("@/services/referee-services/referee-performance.service", () => ({
  useRefereePerformanceService: () => ({
    getMyEvaluations: mockGetMyEvaluations,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RefereePerfWrapper";
  return Wrapper;
};

describe("useRefereePerformance hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee evaluations when campId is provided", async () => {
    const mockPerf = {
      overall_performance: { score: 9.2 },
      performance_breakdown: {},
    };
    mockGetMyEvaluations.mockResolvedValueOnce({
      data: { data: mockPerf },
    });

    const { result } = renderHook(() => useMyEvaluations(22), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetMyEvaluations).toHaveBeenCalledWith(22);
    expect(result.current.data).toEqual(mockPerf);
  });

  it("does not fetch if campId is missing", () => {
    const { result } = renderHook(() => useMyEvaluations(null), {
      wrapper: createWrapper(),
    });

    expect(mockGetMyEvaluations).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
