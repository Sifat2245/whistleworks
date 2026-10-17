import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluatorPreviousCampService } from "../evaluator-previous-camp.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluator-previous-camp.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches previous camps with default and specified page numbers", () => {
    const { result } = renderHook(() => useEvaluatorPreviousCampService());

    result.current.getPreviousCamps();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/evaluator/camp-registration/previous-camps",
      { params: { page: 1 } }
    );

    result.current.getPreviousCamps(3);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/evaluator/camp-registration/previous-camps",
      { params: { page: 3 } }
    );
  });
});
