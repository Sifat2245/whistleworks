import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEvaluatorScheduleService } from "../evaluator-schedule.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("evaluator-schedule.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp roster details and referee details", () => {
    const { result } = renderHook(() => useEvaluatorScheduleService());

    result.current.getCampRosterDetails("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/roster/camp/details/camp-1",
    );

    result.current.getRefereeDetails("camp-1", "ref-5");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/referee-details/camp-1/ref-5",
    );
  });
  it("creates notes with the camp and slot, but sends only note text when updating", () => {
    const { result } = renderHook(() => useEvaluatorScheduleService());
    const body = {
      camp_id: 10,
      note: "Watch transition coverage",
      game_slot_id: 12447,
    };
    result.current.createEvaluationNote(body);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/referee/evaluation/note/store",
      body,
    );
    result.current.updateEvaluationNote(91, body);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/referee/evaluation/note/update/91",
      { note: body.note },
    );
    expect(mockAxiosSecure.post).toHaveBeenCalledTimes(2);
  });
  it("deletes a note using its note ID", () => {
    const { result } = renderHook(() => useEvaluatorScheduleService());
    result.current.deleteEvaluationNote(91);
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/referee/evaluation/note/destroy/91",
    );
  });
});
