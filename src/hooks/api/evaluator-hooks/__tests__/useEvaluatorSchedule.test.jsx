import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCampRosterDetails,
  useRefereeDetails,
} from "../useEvaluatorSchedule";

const mockGetCampRosterDetails = vi.fn();
const mockGetRefereeDetails = vi.fn();

vi.mock("@/services/evaluator-services/evaluator-schedule.service", () => ({
  useEvaluatorScheduleService: () => ({
    getCampRosterDetails: mockGetCampRosterDetails,
    getRefereeDetails: mockGetRefereeDetails,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "EvaluatorScheduleWrapper";
  return Wrapper;
};

describe("useEvaluatorSchedule hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp roster details when campId is set", async () => {
    mockGetCampRosterDetails.mockResolvedValueOnce({
      data: { data: { camp: { id: 10, name: "Evaluator Camp Roster" } } },
    });

    const { result } = renderHook(() => useCampRosterDetails(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetCampRosterDetails).toHaveBeenCalledWith(10);
    expect(result.current.data).toEqual({ id: 10, name: "Evaluator Camp Roster" });
  });

  it("fetches referee details when campId and refereeId are present", async () => {
    mockGetRefereeDetails.mockResolvedValueOnce({
      data: { data: { referee: { id: 5, name: "Referee Mike" } } },
    });

    const { result } = renderHook(() => useRefereeDetails(10, 5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetRefereeDetails).toHaveBeenCalledWith(10, 5);
    expect(result.current.data).toEqual({ referee: { id: 5, name: "Referee Mike" } });
  });

  it("does not fetch referee details if refereeId is missing", () => {
    const { result } = renderHook(() => useRefereeDetails(10, null), {
      wrapper: createWrapper(),
    });

    expect(mockGetRefereeDetails).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
