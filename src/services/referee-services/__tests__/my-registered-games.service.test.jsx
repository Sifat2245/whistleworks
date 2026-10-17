import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMyRegisteredGamesService } from "../my-registered-games.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("my-registered-games.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registered games with pagination parameters", () => {
    const { result } = renderHook(() => useMyRegisteredGamesService());

    result.current.getMyRegistrations(1, 10);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/referee/camp/my-registrations", {
      params: { page: 1, per_page: 10 },
    });
  });
});
