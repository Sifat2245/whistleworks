import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRankingService } from "../ranking.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("ranking.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee evaluations and ranking settings", () => {
    const { result } = renderHook(() => useRankingService());

    result.current.getRefereeEvaluations("camp-123");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee/evaluation/camp/camp-123");

    result.current.getRankingSettings("camp-123");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/camp/camp-123/ranking-settings");
  });

  it("updates ranking settings and fetches referee evaluation history", () => {
    const { result } = renderHook(() => useRankingService());

    result.current.updateRankingSettings({
      campId: "camp-123",
      payload: { threshold: 85 },
    });
    expect(mockAxiosSecure.put).toHaveBeenCalledWith(
      "/camp/camp-123/ranking-settings",
      { threshold: 85 }
    );

    result.current.getRefereeEvaluationHistory("camp-123", "ref-5", 3);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/camp/camp-123/referee/ref-5/history?page=3"
    );
  });
});
