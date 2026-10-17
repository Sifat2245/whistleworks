import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluatorScheduleService } from "../evaluator-schedule.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluator-schedule.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp roster details and referee details", () => {
    const { result } = renderHook(() => useEvaluatorScheduleService());

    result.current.getCampRosterDetails("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/roster/camp/details/camp-1");

    result.current.getRefereeDetails("camp-1", "ref-5");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee-details/camp-1/ref-5");
  });
});
