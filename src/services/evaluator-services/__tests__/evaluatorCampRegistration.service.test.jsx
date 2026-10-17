import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluatorCampRegistrationService } from "../evaluatorCampRegistration.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluatorCampRegistration.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registrations and previous camps with pagination params", () => {
    const { result } = renderHook(() => useEvaluatorCampRegistrationService());

    result.current.getMyRegistrations(2, 24);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/evaluator/camp-registration/my-registrations",
      { params: { page: 2, per_page: 24 } }
    );

    result.current.getPreviousCamps(1);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/evaluator/camp-registration/previous-camps",
      { params: { page: 1 } }
    );
  });

  it("handles registering for camp and cancelling registration", () => {
    const { result } = renderHook(() => useEvaluatorCampRegistrationService());

    const payload = { camp_id: "camp-1", note: "Excited" };
    result.current.registerForCamp(payload);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/evaluator/camp-registration/register",
      payload
    );

    result.current.cancelRegistration("reg-99");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/evaluator/camp-registration/cancel/reg-99"
    );
  });
});
