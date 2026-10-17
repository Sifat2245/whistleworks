import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExportService } from "../export.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("export.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles blob exports for schedule, ranking, referees, and evaluators", () => {
    const { result } = renderHook(() => useExportService());

    result.current.exportSchedule("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/roster/export/camp/camp-1", {
      responseType: "blob",
    });

    result.current.exportRanking("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee/evaluation/export/camp/camp-1",
      { responseType: "blob" }
    );

    result.current.exportReferees("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/roster/export/referees/camp/camp-1",
      { responseType: "blob" }
    );

    result.current.exportEvaluators("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/evaluator-registrations/export/camp/camp-1",
      { responseType: "blob" }
    );
  });

  it("handles crews export", () => {
    const { result } = renderHook(() => useExportService());

    result.current.exportCrews("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/crews/export/camp/camp-1");
  });
});
