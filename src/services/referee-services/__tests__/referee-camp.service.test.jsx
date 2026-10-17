import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRefereeCampService } from "../referee-camp.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("referee-camp.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee checkins, registrations, and previous camps with pagination", () => {
    const { result } = renderHook(() => useRefereeCampService());

    result.current.getMyCheckins(2, 15);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/referee/camp/my-checkins", {
      params: { page: 2, per_page: 15 },
    });

    result.current.getMyRegistrations(1, 20);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/referee/camp/my-registrations", {
      params: { page: 1, per_page: 20 },
    });

    result.current.getPreviousCamps(3);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/referee/camp/previous-camps", {
      params: { page: 3 },
    });
  });

  it("handles checkin and registration mutations", () => {
    const { result } = renderHook(() => useRefereeCampService());

    result.current.checkIn("camp-1");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith("/v1/referee/camp/camp-1/checkin");

    const payload = { tier: "gold" };
    result.current.register("camp-1", payload);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v2/referee/camp/camp-1/register",
      payload
    );
  });
});
