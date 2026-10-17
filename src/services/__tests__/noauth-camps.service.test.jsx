import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNoAuthCampService } from "../noauth-camps.service";

const mockAxiosPublic = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosPublic", () => ({ default: () => mockAxiosPublic }));

describe("noauth-camps.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches public camps with params, camp details, sports types, and locations", () => {
    const { result } = renderHook(() => useNoAuthCampService());

    result.current.getCamps({ search: "summer", page: 2 });
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/v1/camp/list", {
      params: { search: "summer", page: 2 },
    });

    result.current.getCampDetails("camp-42");
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/no-auth/camp/details/camp-42");

    result.current.getSportsTypes();
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/v1/camp/sports-type");

    result.current.getLocations();
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/v1/camp/locations");
  });
});
