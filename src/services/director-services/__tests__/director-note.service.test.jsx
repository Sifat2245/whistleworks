import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDirectorNoteService } from "../director-note.service";

const mockAxiosSecure = vi.hoisted(() => ({
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("director-note.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls updateRefereeNote with correct endpoint and payload", () => {
    const { result } = renderHook(() => useDirectorNoteService());

    result.current.updateRefereeNote("camp-123", "ref-456", "Needs extra water break");
    expect(mockAxiosSecure.patch).toHaveBeenCalledWith(
      "/v1/director/camp/camp-123/referee/ref-456/update-note",
      { notes: "Needs extra water break" },
    );
  });

  it("calls deleteRefereeNote with correct endpoint", () => {
    const { result } = renderHook(() => useDirectorNoteService());

    result.current.deleteRefereeNote("camp-123", "ref-456");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/v1/director/camp/camp-123/referee/ref-456/note",
    );
  });
});
