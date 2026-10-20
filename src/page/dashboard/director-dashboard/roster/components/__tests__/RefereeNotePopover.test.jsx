import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RefereeNotePopover from "../RefereeNotePopover";

const mockMutateUpdate = vi.fn();
const mockMutateDelete = vi.fn();

vi.mock("@/hooks/api/director-hooks/useDirectorNote", () => ({
  useUpdateRefereeNote: () => ({
    mutateAsync: mockMutateUpdate,
    isPending: false,
  }),
  useDeleteRefereeNote: () => ({
    mutateAsync: mockMutateDelete,
    isPending: false,
  }),
}));

describe("RefereeNotePopover Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ReadOnly mode (used in RefereeAssignModal)", () => {
    it("renders nothing when referee has no notes", () => {
      const { container } = render(
        <RefereeNotePopover
          campId="camp-1"
          referee={{ id: 101, name: "Referee John", notes: null }}
          readOnly={true}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders Note button when referee has notes and opens popover on click", async () => {
      render(
        <RefereeNotePopover
          campId="camp-1"
          referee={{ id: 101, name: "Referee John", notes: "Prefers Court 2" }}
          readOnly={true}
        />
      );

      const noteBtn = screen.getByRole("button", { name: /view referee note/i });
      expect(noteBtn).toBeInTheDocument();
      expect(screen.getByText("Note")).toBeInTheDocument();

      fireEvent.click(noteBtn);

      expect(await screen.findByText(/Note for Referee John/i)).toBeInTheDocument();
      expect(screen.getByText("Prefers Court 2")).toBeInTheDocument();
      expect(screen.queryByTitle(/Edit Note/i)).not.toBeInTheDocument();
      expect(screen.queryByTitle(/Delete Note/i)).not.toBeInTheDocument();
    });
  });

  describe("Editable mode (used in Roster page)", () => {
    it("renders add note button when referee has no notes and allows adding note", async () => {
      render(
        <RefereeNotePopover
          campId="camp-1"
          referee={{ id: 101, name: "Referee Alex", notes: null }}
          readOnly={false}
        />
      );

      const noteBtn = screen.getByRole("button", { name: /add referee note/i });
      expect(noteBtn).toBeInTheDocument();

      fireEvent.click(noteBtn);

      const textarea = await screen.findByPlaceholderText(/add note for this referee/i);
      expect(textarea).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: "Great game control" } });
      const addBtn = screen.getByRole("button", { name: /add note/i });

      mockMutateUpdate.mockResolvedValueOnce({ data: { message: "Saved" } });
      fireEvent.click(addBtn);

      await waitFor(() => {
        expect(mockMutateUpdate).toHaveBeenCalledWith({
          refereeId: 101,
          notes: "Great game control",
        });
      });
    });

    it("renders active button and allows viewing, editing, and deleting existing note", async () => {
      render(
        <RefereeNotePopover
          campId="camp-1"
          referee={{ id: 102, name: "Referee Sarah", notes: "Needs shadow evaluator" }}
          readOnly={false}
        />
      );

      const noteBtn = screen.getByRole("button", { name: /view\/edit referee note/i });
      expect(noteBtn).toBeInTheDocument();

      fireEvent.click(noteBtn);

      expect(await screen.findByText("Needs shadow evaluator")).toBeInTheDocument();

      // Click Edit
      const editBtn = screen.getByTitle("Edit Note");
      fireEvent.click(editBtn);

      const textarea = screen.getByPlaceholderText(/add note for this referee/i);
      expect(textarea.value).toBe("Needs shadow evaluator");

      // Test delete
      mockMutateDelete.mockResolvedValueOnce({ data: { message: "Deleted" } });
      // Cancel edit mode first to see delete button
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

      const deleteBtn = screen.getByTitle("Delete Note");
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(mockMutateDelete).toHaveBeenCalledWith(102);
      });
    });
  });

  describe("Mobile responsiveness", () => {
    it("renders modal on mobile screen size when clicked", async () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event("resize"));

      render(
        <RefereeNotePopover
          campId="camp-1"
          referee={{ id: 103, name: "Referee Mobile", notes: "Mobile note test" }}
          readOnly={true}
        />
      );

      const noteBtn = screen.getByRole("button", { name: /view referee note/i });
      fireEvent.click(noteBtn);

      expect(await screen.findByText(/Note for Referee Mobile/i)).toBeInTheDocument();
      expect(screen.getByText("Mobile note test")).toBeInTheDocument();

      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });
  });
});
