import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCampRosterDetails,
  useCheckInReferee,
  useRemoveRefereeFromRoster,
  useUpdateJerseyNumber,
} from "../useRosterForDirector";

const mockGetCampRosterDetails = vi.fn();
const mockCheckInReferee = vi.fn();
const mockRemoveReferee = vi.fn();
const mockUpdateJerseyNumber = vi.fn();

vi.mock("@/services/director-services/rosterForDirector.service", () => ({
  useRosterService: () => ({
    getCampRosterDetails: mockGetCampRosterDetails,
    checkInReferee: mockCheckInReferee,
    removeReferee: mockRemoveReferee,
    updateJerseyNumber: mockUpdateJerseyNumber,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
  Wrapper.displayName = "RosterWrapper";
  return Wrapper;
};

describe("useRosterForDirector hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp roster details when campId is present", async () => {
    const mockCampRoster = {
      id: 15,
      name: "Roster Camp",
      referees: [{ id: 1, name: "Referee 1" }],
    };
    mockGetCampRosterDetails.mockResolvedValueOnce({
      data: { data: { camp: mockCampRoster } },
    });

    const { result } = renderHook(() => useCampRosterDetails(15), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetCampRosterDetails).toHaveBeenCalledWith(15);
    expect(result.current.data).toEqual(mockCampRoster);
  });

  it("handles check-in, remove, and jersey update mutations", async () => {
    mockCheckInReferee.mockResolvedValueOnce({ data: { message: "Checked In" } });
    mockRemoveReferee.mockResolvedValueOnce({ data: { message: "Removed" } });
    mockUpdateJerseyNumber.mockResolvedValueOnce({ data: { message: "Updated" } });

    const { result: checkInHook } = renderHook(() => useCheckInReferee(15), {
      wrapper: createWrapper(),
    });
    const { result: removeHook } = renderHook(() => useRemoveRefereeFromRoster(15), {
      wrapper: createWrapper(),
    });
    const { result: jerseyHook } = renderHook(() => useUpdateJerseyNumber(15), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await checkInHook.current.mutateAsync(1);
      await removeHook.current.mutateAsync(1);
      await jerseyHook.current.mutateAsync({ refereeId: 1, jourcyNumber: "23" });
    });

    expect(mockCheckInReferee).toHaveBeenCalledWith(15, 1);
    expect(mockRemoveReferee).toHaveBeenCalledWith(15, 1);
    expect(mockUpdateJerseyNumber).toHaveBeenCalledWith(15, 1, "23");
  });
});
