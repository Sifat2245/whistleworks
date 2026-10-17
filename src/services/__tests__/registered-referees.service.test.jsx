import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRegisteredRefereesService } from "../registered-referees.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("registered-referees.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registered referees for a camp with default and specified page", () => {
    const { result } = renderHook(() => useRegisteredRefereesService());

    result.current.getRegisteredReferees("camp-99");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/camp/camp-99/all-referees",
      { params: { page: 1 } }
    );

    result.current.getRegisteredReferees("camp-99", 3);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/camp/camp-99/all-referees",
      { params: { page: 3 } }
    );
  });
});
