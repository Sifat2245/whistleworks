import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluationService } from "../evaluation.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluation.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registered referees for a camp", () => {
    const { result } = renderHook(() => useEvaluationService());
    result.current.getRegisteredReferees("camp-1", 2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/camp/camp-1/all-referees",
      { params: { page: 2 } }
    );
  });

  it("handles getRecommendLevels with primitive campId and object parameters", () => {
    const { result } = renderHook(() => useEvaluationService());

    result.current.getRecommendLevels("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/recommended-highest-level",
      { params: { format: "objects", camp_id: "camp-1" } }
    );

    result.current.getRecommendLevels({ campId: "camp-2", sport: "basketball" });
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/recommended-highest-level",
      { params: { format: "objects", camp_id: "camp-2", sport: "basketball" } }
    );
  });

  it("handles storing, submitting (alias), updating, and deleting evaluations", () => {
    const { result } = renderHook(() => useEvaluationService());

    const formData = { score: 90 };
    result.current.storeEvaluation(formData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/referee/evaluation/store",
      formData
    );

    result.current.submitEvaluation(formData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/referee/evaluation/store",
      formData
    );

    result.current.updateEvaluation("eval-1", formData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/referee/evaluation/update/eval-1",
      formData
    );

    result.current.deleteEvaluation("eval-1");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/referee/evaluation/destroy/eval-1"
    );
  });

  it("handles fetching evaluations list, details, rankings, and stats", () => {
    const { result } = renderHook(() => useEvaluationService());

    result.current.getMyCampEvaluations("camp-1", 1, { filter: "recent" });
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/my-evaluations/camp-1",
      { params: { page: 1, filter: "recent" } }
    );

    result.current.getEvaluationDetails("eval-99");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee/evaluation/details/eval-99");

    result.current.getRefereeEvaluation("camp-1", "ref-5");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/camp/camp-1/referee/ref-5"
    );

    result.current.getCampEvaluations("camp-1", 2, { sort: "asc" });
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/camp/camp-1/all-evaluations",
      { params: { page: 2, sort: "asc" } }
    );

    result.current.getRefereeRankings("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee/evaluation/camp/camp-1/rankings");

    result.current.getEvaluationStats("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/referee/evaluation/camp/camp-1/stats");
  });
});
