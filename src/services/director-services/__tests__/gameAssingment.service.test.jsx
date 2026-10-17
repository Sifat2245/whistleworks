import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGameAssignmentService } from "../gameAssingment.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("gameAssingment.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles queries: getAvailableDates, getCourtInfo, getAvailableReferees, getAvailableCrews", () => {
    const { result } = renderHook(() => useGameAssignmentService());

    result.current.getAvailableDates("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/camp/camp-1/schedule/game-slots"
    );

    result.current.getCourtInfo("camp-1", "2025-06-15");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/camp/camp-1/schedule/game-slots?date=2025-06-15"
    );

    result.current.getAvailableReferees("slot-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/director/court-assign/slot/slot-1/available-referees-with-time-check"
    );

    result.current.getAvailableCrews("slot-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/director/court-assign/slot/slot-1/available-crew-with-time-check"
    );
  });

  it("handles court name updates and slot blocking mutations", () => {
    const { result } = renderHook(() => useGameAssignmentService());

    result.current.bulkUpdateCourtNames("loc-1", 2, " Court 2 Main ");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/location/loc-1/courts/bulk-update-names",
      expect.any(FormData)
    );

    result.current.toggleBlockSlot("slot-5");
    expect(mockAxiosSecure.patch).toHaveBeenCalledWith(
      "/v1/slot/slot-5/toggle-block"
    );

    const blockData = { slot_ids: [1, 2] };
    result.current.bulkToggleBlock("sched-1", blockData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/schedule/sched-1/bulk-toggle-block",
      blockData
    );
  });

  it("handles assignments, auto-assign, and mode switches", () => {
    const { result } = renderHook(() => useGameAssignmentService());

    const refFormData = new FormData();
    result.current.assignReferees("slot-1", refFormData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/director/court-assign/slot/slot-1/assign-individual",
      refFormData
    );

    const crewData = { crew_id: 10 };
    result.current.assignCrew("slot-1", crewData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/director/court-assign/slot/slot-1/assign-crew",
      crewData
    );

    result.current.removeAssignment("assign-99");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/v1/director/court-assign/assignment/assign-99/remove"
    );

    result.current.autoAssignReferees("camp-1");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/director/court-assign/camp/camp-1/auto-assign"
    );

    result.current.courtModeChange("slot-1", "crew");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/director/court-assign/slot/slot-1/switch-mode",
      { mode: "crew" }
    );

    result.current.bulkModeChange("camp-1", "sched-1", "individual");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/director/court-assign/camp/camp-1/schedule/sched-1/bulk-switch-mode",
      { mode: "individual" }
    );
  });
});
