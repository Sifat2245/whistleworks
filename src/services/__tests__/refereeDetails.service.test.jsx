import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRefereeDetailsService } from "../refereeDetails.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("refereeDetails.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee details by campId and refereeId", () => {
    const { result } = renderHook(() => useRefereeDetailsService());

    result.current.getRefereeDetails("camp-1", "ref-2");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee-details/camp-1/ref-2");
  });
});
