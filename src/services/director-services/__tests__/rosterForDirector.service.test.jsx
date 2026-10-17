import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRosterService } from "../rosterForDirector.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("rosterForDirector.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp roster details", () => {
    const { result } = renderHook(() => useRosterService());

    result.current.getCampRosterDetails("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/roster/camp/details/camp-1");
  });

  it("handles checkInReferee, removeReferee, and updateJerseyNumber mutations", () => {
    const { result } = renderHook(() => useRosterService());

    result.current.checkInReferee("camp-1", "ref-2");
    expect(mockAxiosSecure.put).toHaveBeenCalledWith(
      "/v1/director/camp/camp-1/referee/ref-2/manual-checkin"
    );

    result.current.removeReferee("camp-1", "ref-2");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/v1/director/camps/camp-1/referees/ref-2"
    );

    result.current.updateJerseyNumber("camp-1", "ref-2", "23");
    expect(mockAxiosSecure.patch).toHaveBeenCalledWith(
      "/v1/director/camp/camp-1/referee/ref-2/update-jourcy-number",
      null,
      { params: { jourcy_number: "23" } }
    );
  });
});
