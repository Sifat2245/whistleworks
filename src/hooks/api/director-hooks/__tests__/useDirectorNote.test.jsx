import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useUpdateRefereeNote,
  useDeleteRefereeNote,
} from "../useDirectorNote";
import toast from "react-hot-toast";

const mockUpdateRefereeNote = vi.fn();
const mockDeleteRefereeNote = vi.fn();

vi.mock("@/services/director-services/director-note.service", () => ({
  useDirectorNoteService: () => ({
    updateRefereeNote: mockUpdateRefereeNote,
    deleteRefereeNote: mockDeleteRefereeNote,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "DirectorNoteWrapper";
  return { Wrapper, queryClient };
};

describe("useDirectorNote hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUpdateRefereeNote", () => {
    it("successfully updates referee note and updates query cache optimistically", async () => {
      const { Wrapper, queryClient } = createWrapper();
      const campId = "camp-1";
      const initialRoster = {
        camp_id: campId,
        referees: [
          { id: 101, name: "Referee 101", notes: null },
          { id: 102, name: "Referee 102", notes: "Old Note" },
        ],
      };
      queryClient.setQueryData(["camp-roster-details", campId], initialRoster);

      mockUpdateRefereeNote.mockResolvedValueOnce({
        data: { success: true, message: "Note saved successfully" },
      });

      const { result } = renderHook(() => useUpdateRefereeNote(campId), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          refereeId: 101,
          notes: "Excellent positioning",
        });
      });

      expect(mockUpdateRefereeNote).toHaveBeenCalledWith(
        campId,
        101,
        "Excellent positioning",
      );
      expect(toast.success).toHaveBeenCalledWith("Note saved successfully");

      const cached = queryClient.getQueryData(["camp-roster-details", campId]);
      expect(cached.referees[0].notes).toBe("Excellent positioning");
    });

    it("handles error and displays error toast", async () => {
      const { Wrapper, queryClient } = createWrapper();
      const campId = "camp-1";
      const initialRoster = {
        camp_id: campId,
        referees: [{ id: 101, name: "Referee 101", notes: null }],
      };
      queryClient.setQueryData(["camp-roster-details", campId], initialRoster);

      mockUpdateRefereeNote.mockRejectedValueOnce({
        response: { data: { message: "Failed to save note." } },
      });

      const { result } = renderHook(() => useUpdateRefereeNote(campId), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            refereeId: 101,
            notes: "Test",
          });
        } catch {
          // Expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith("Failed to save note.");
    });
  });

  describe("useDeleteRefereeNote", () => {
    it("successfully deletes referee note and removes it optimistically", async () => {
      const { Wrapper, queryClient } = createWrapper();
      const campId = "camp-1";
      const initialRoster = {
        camp_id: campId,
        referees: [{ id: 101, name: "Referee 101", notes: "Some note" }],
      };
      queryClient.setQueryData(["camp-roster-details", campId], initialRoster);

      mockDeleteRefereeNote.mockResolvedValueOnce({
        data: { success: true, message: "Note removed successfully" },
      });

      const { result } = renderHook(() => useDeleteRefereeNote(campId), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(101);
      });

      expect(mockDeleteRefereeNote).toHaveBeenCalledWith(campId, 101);
      expect(toast.success).toHaveBeenCalledWith("Note removed successfully");

      const cached = queryClient.getQueryData(["camp-roster-details", campId]);
      expect(cached.referees[0].notes).toBeNull();
    });

    it("handles error on delete and restores previous state", async () => {
      const { Wrapper, queryClient } = createWrapper();
      const campId = "camp-1";
      const initialRoster = {
        camp_id: campId,
        referees: [{ id: 101, name: "Referee 101", notes: "Keep this" }],
      };
      queryClient.setQueryData(["camp-roster-details", campId], initialRoster);

      mockDeleteRefereeNote.mockRejectedValueOnce({
        response: { data: { message: "Failed to remove note." } },
      });

      const { result } = renderHook(() => useDeleteRefereeNote(campId), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(101);
        } catch {
          // Expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith("Failed to remove note.");
      const cached = queryClient.getQueryData(["camp-roster-details", campId]);
      expect(cached.referees[0].notes).toBe("Keep this");
    });
  });
});
