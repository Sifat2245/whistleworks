import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMyEvaluations,
  useMyEvaluationDetails,
} from "@/hooks/api/referee-hooks/useRefereePerformance";

const mockGetMyEvaluations = vi.fn();
const mockGetMyEvaluationDetails = vi.fn();

vi.mock("@/services/referee-services/referee-performance.service", () => ({
  useRefereePerformanceService: () => ({
    getMyEvaluations: mockGetMyEvaluations,
    getMyEvaluationDetails: mockGetMyEvaluationDetails,
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

describe("referee evaluation details", () => {
  beforeEach(() => mockGetMyEvaluationDetails.mockReset());

  it.each([
    { id: null, enabled: true },
    { id: 3609, enabled: false },
  ])(
    "does not fetch without an open selected evaluation (%o)",
    ({ id, enabled }) => {
      renderHook(() => useMyEvaluationDetails(id, { enabled }), {
        wrapper: createWrapper(),
      });
      expect(mockGetMyEvaluationDetails).not.toHaveBeenCalled();
    },
  );

  it("does not reuse another evaluation's data during loading", async () => {
    mockGetMyEvaluationDetails
      .mockResolvedValueOnce({ data: { success: true, data: { id: 3609 } } })
      .mockImplementationOnce(() => new Promise(() => {}));
    const { result, rerender } = renderHook(
      ({ id }) => useMyEvaluationDetails(id),
      { wrapper: createWrapper(), initialProps: { id: 3609 } },
    );
    await waitFor(() => expect(result.current.data?.id).toBe(3609));
    rerender({ id: 3242 });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(mockGetMyEvaluationDetails).toHaveBeenLastCalledWith(3242);
  });

  it("treats a failure body as an error without retrying a forbidden request", async () => {
    mockGetMyEvaluationDetails.mockResolvedValue({
      status: 200,
      data: {
        success: false,
        message: "Evaluation is unavailable.",
        data: null,
        code: 403,
      },
    });
    const { result } = renderHook(() => useMyEvaluationDetails(3609), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Evaluation is unavailable.");
    expect(mockGetMyEvaluationDetails).toHaveBeenCalledTimes(1);
  });
});
