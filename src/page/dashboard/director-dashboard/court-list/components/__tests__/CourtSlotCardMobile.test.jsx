import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CourtSlotCardMobile from "../CourtSlotCardMobile";

const mockMutateRemove = vi.fn();

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useRemoveAssignment: () => ({
    mutate: mockMutateRemove,
    isPending: false,
  }),
}));

const mockCourt = {
  slot_id: 301,
  court_number: 1,
  court_name: "Court 1",
  location_id: 10,
  assignments: [],
  positions: [
    { id: 1, position: "Main Referee", is_assigned: false },
    { id: 2, position: "Assistant", is_assigned: false },
  ],
};

const mockTimeSlot = {
  time: "09:00 AM",
};

describe("CourtSlotCardMobile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders court card with name, address, and block action button", () => {
    const handleToggleBlock = vi.fn();

    render(
      <CourtSlotCardMobile
        court={mockCourt}
        timeSlot={mockTimeSlot}
        address="Court Address 123"
        onToggleBlock={handleToggleBlock}
      />
    );

    expect(screen.getByText("Court 1")).toBeInTheDocument();
    expect(screen.getByText("Court Address 123")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /block/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /block/i }));
    expect(handleToggleBlock).toHaveBeenCalledWith(301);
  });

  it("renders blocked state and allows unblocking", () => {
    const handleToggleBlock = vi.fn();

    render(
      <CourtSlotCardMobile
        court={mockCourt}
        timeSlot={mockTimeSlot}
        isBlocked={true}
        onToggleBlock={handleToggleBlock}
      />
    );

    expect(screen.getByRole("button", { name: /unblock/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /unblock/i }));
    expect(handleToggleBlock).toHaveBeenCalledWith(301);
  });

  it("allows renaming court when editing is active", () => {
    const handleSaveEdit = vi.fn();
    const handleSetEditValue = vi.fn();

    render(
      <CourtSlotCardMobile
        court={mockCourt}
        timeSlot={mockTimeSlot}
        isEditing={true}
        editValue="Stadium Center"
        setEditValue={handleSetEditValue}
        onSaveEdit={handleSaveEdit}
      />
    );

    const input = screen.getByPlaceholderText("Court name...");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Stadium Center");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleSaveEdit).toHaveBeenCalledWith(10, 1);
  });

  it("triggers onOpen when clicking an unassigned slot position", () => {
    const handleOpen = vi.fn();

    render(
      <CourtSlotCardMobile
        court={mockCourt}
        timeSlot={mockTimeSlot}
        onOpen={handleOpen}
        assignmentType="individual"
      />
    );

    const assignBtns = screen.getAllByText("Assign");
    expect(assignBtns.length).toBeGreaterThan(0);

    fireEvent.click(assignBtns[0]);
    expect(handleOpen).toHaveBeenCalled();
  });
});
