import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMyCheckedInGamesService } from "../my-checkedin-games.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("my-checkedin-games.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches checked-in games with pagination parameters", () => {
    const { result } = renderHook(() => useMyCheckedInGamesService());

    result.current.getMyCheckins(1, 10);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/referee/camp/my-checkins", {
      params: { page: 1, per_page: 10 },
    });
  });
});
