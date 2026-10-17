import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAvailableDates,
  useCourtInfo,
  useAvailableReferees,
  useAvailableCrews,
  useToggleBlockSlot,
  useAssignReferees,
  useAssignCrew,
  useCourtModeChange,
} from "../useGameAssingments";

const mockGetAvailableDates = vi.fn();
const mockGetCourtInfo = vi.fn();
const mockGetAvailableReferees = vi.fn();
const mockGetAvailableCrews = vi.fn();
const mockToggleBlockSlot = vi.fn();
const mockAssignReferees = vi.fn();
const mockAssignCrew = vi.fn();
const mockCourtModeChange = vi.fn();

vi.mock("@/services/director-services/gameAssingment.service", () => ({
  useGameAssignmentService: () => ({
    getAvailableDates: mockGetAvailableDates,
    getCourtInfo: mockGetCourtInfo,
    getAvailableReferees: mockGetAvailableReferees,
    getAvailableCrews: mockGetAvailableCrews,
    toggleBlockSlot: mockToggleBlockSlot,
    assignReferees: mockAssignReferees,
    assignCrew: mockAssignCrew,
    courtModeChange: mockCourtModeChange,
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
  Wrapper.displayName = "GameAssignmentsWrapper";
  return Wrapper;
};

describe("useGameAssignments hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches available dates, court info, referees, and crews", async () => {
    mockGetAvailableDates.mockResolvedValueOnce({
      data: { data: ["2026-06-01"] },
    });
    mockGetCourtInfo.mockResolvedValueOnce({
      data: { data: { courts: [{ id: 1, name: "Court 1" }] } },
    });
    mockGetAvailableReferees.mockResolvedValueOnce({
      data: { data: { referees: [{ id: 1, name: "Referee Mike" }] } },
    });
    mockGetAvailableCrews.mockResolvedValueOnce({
      data: { data: { crews: [{ id: 2, name: "Crew Bravo" }] } },
    });

    const { result: datesHook } = renderHook(() => useAvailableDates(10), {
      wrapper: createWrapper(),
    });
    const { result: courtHook } = renderHook(() => useCourtInfo(10, "2026-06-01"), {
      wrapper: createWrapper(),
    });
    const { result: refHook } = renderHook(() => useAvailableReferees(10, 50, true), {
      wrapper: createWrapper(),
    });
    const { result: crewHook } = renderHook(() => useAvailableCrews(10, 50, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(datesHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(courtHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(refHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(crewHook.current.isSuccess).toBe(true));

    expect(datesHook.current.data).toEqual(["2026-06-01"]);
    expect(courtHook.current.data).toEqual({ courts: [{ id: 1, name: "Court 1" }] });
    expect(refHook.current.data).toEqual([{ id: 1, name: "Referee Mike" }]);
    expect(crewHook.current.data).toEqual([{ id: 2, name: "Crew Bravo" }]);
  });

  it("executes slot toggle, referee assign, crew assign, and mode change mutations", async () => {
    mockToggleBlockSlot.mockResolvedValueOnce({ data: { message: "Toggled" } });
    mockAssignReferees.mockResolvedValueOnce({ data: { message: "Referees Assigned" } });
    mockAssignCrew.mockResolvedValueOnce({ data: { message: "Crew Assigned" } });
    mockCourtModeChange.mockResolvedValueOnce({ data: { message: "Mode changed" } });

    const { result: blockHook } = renderHook(() => useToggleBlockSlot(10, "2026-06-01"), {
      wrapper: createWrapper(),
    });
    const { result: assignRefHook } = renderHook(() => useAssignReferees(), {
      wrapper: createWrapper(),
    });
    const { result: assignCrewHook } = renderHook(() => useAssignCrew(), {
      wrapper: createWrapper(),
    });
    const { result: modeHook } = renderHook(() => useCourtModeChange(10, "2026-06-01"), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await blockHook.current.mutateAsync(50);
      await assignRefHook.current.mutateAsync({ slotId: 50, payload: { ref: 1 } });
      await assignCrewHook.current.mutateAsync({ slotId: 50, data: { crew: 2 } });
      await modeHook.current.mutateAsync({ slotId: 1, mode: "individual" });
    });

    expect(mockToggleBlockSlot).toHaveBeenCalledWith(50);
    expect(mockAssignReferees).toHaveBeenCalledWith(50, { ref: 1 });
    expect(mockAssignCrew).toHaveBeenCalledWith(50, { crew: 2 });
    expect(mockCourtModeChange).toHaveBeenCalledWith(1, "individual");
  });
});
