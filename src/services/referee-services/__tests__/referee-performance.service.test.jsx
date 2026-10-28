import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRefereePerformanceService } from "../referee-performance.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("referee-performance.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee evaluations for a given camp", () => {
    const { result } = renderHook(() => useRefereePerformanceService());

    result.current.getMyEvaluations("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/my-evaluations/camp-1",
    );
  });

  it("fetches the selected evaluation details using its evaluation ID", () => {
    const { result } = renderHook(() => useRefereePerformanceService());

    result.current.getMyEvaluationDetails(3609);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/my-evaluations/details/3609",
    );
  });
});
