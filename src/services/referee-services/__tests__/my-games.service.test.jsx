import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRefereeGamesService } from "../my-games.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("my-games.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee assigned slots with pagination", () => {
    const { result } = renderHook(() => useRefereeGamesService());

    result.current.getAssignedSlots("camp-1", 2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/camp/camp-1/assigned-slots",
      { params: { page: 2 } }
    );
  });
});
