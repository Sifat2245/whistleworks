import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCampRegistrationService } from "../RefereeCampRegistration.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("RefereeCampRegistration.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp pricing and applies coupon", () => {
    const { result } = renderHook(() => useCampRegistrationService());

    result.current.campPrice("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v2/referee/camp/camp-1/pricing");

    const couponData = { coupon_code: "EARLYBIRD" };
    result.current.applyCoupon("camp-1", couponData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v2/referee/camp/camp-1/validate-coupon",
      couponData
    );
  });
});
