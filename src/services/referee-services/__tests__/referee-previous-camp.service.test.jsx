import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRefereePreviousCampService } from "../referee-previous-camp.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("referee-previous-camp.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee previous camps with default and specified page numbers", () => {
    const { result } = renderHook(() => useRefereePreviousCampService());

    result.current.getPreviousCamps();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/referee/camp/previous-camps",
      { params: { page: 1 } }
    );

    result.current.getPreviousCamps(4);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/referee/camp/previous-camps",
      { params: { page: 4 } }
    );
  });
});
