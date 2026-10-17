import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluatorService } from "../evaluator.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluator.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pending, approved, and rejected evaluators with pagination", () => {
    const { result } = renderHook(() => useEvaluatorService());

    result.current.getPendingEvaluators("camp-1", 2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/roster/evaluator-registrations/camp/camp-1/pending",
      { params: { page: 2 } }
    );

    result.current.getApprovedEvaluators("camp-1", 1);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/roster/evaluator-registrations/camp/camp-1/approved",
      { params: { page: 1 } }
    );

    result.current.getAllRejectedEvaluators("camp-1", 3);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/roster/evaluator-registrations/camp/camp-1/rejected",
      { params: { page: 3 } }
    );
  });

  it("handles approve, reject, and remove evaluator mutations", () => {
    const { result } = renderHook(() => useEvaluatorService());

    result.current.approveEvaluator("reg-1");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/director/evaluator-registrations/approve/reg-1"
    );

    result.current.rejectEvaluator("reg-2");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/director/evaluator-registrations/reject/reg-2"
    );

    result.current.removeEvaluator("reg-3");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/director/evaluator-registrations/remove/reg-3"
    );
  });
});
