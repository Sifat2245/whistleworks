import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import CourtSlotBox from "../CourtSlotBox";

const mockMutateRemove = vi.fn();

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useRemoveAssignment: () => ({
    mutate: mockMutateRemove,
    isPending: false,
  }),
}));

const mockCourtEmpty = {
  slot_id: 201,
  court_number: 1,
  assignments: [],
  positions: [
    { id: 1, position: "Main Referee", is_assigned: false },
    { id: 2, position: "Assistant Referee", is_assigned: false },
  ],
};

const mockTimeSlot = {
  time: "08:30 AM",
};

describe("CourtSlotBox Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders blocked view and triggers onUndoBlock when unblock is clicked", () => {
    const handleUndoBlock = vi.fn();
    render(
      <CourtSlotBox
        court={mockCourtEmpty}
        timeSlot={mockTimeSlot}
        isBlocked={true}
        onUndoBlock={handleUndoBlock}
      />
    );

    expect(screen.getByText("Blocked")).toBeInTheDocument();
    const unblockBtn = screen.getByRole("button", { name: /unblock slot/i });
    fireEvent.click(unblockBtn);

    expect(handleUndoBlock).toHaveBeenCalledWith(201);
  });

  it("renders crew assigned view with member roster and remove button", async () => {
    const courtWithCrew = {
      ...mockCourtEmpty,
      assignments: [
        {
          type: "crew",
          id: 55,
          assignment_id: 55,
          crew_name: "Tigers Crew",
          member_count: 2,
          members: [
            { id: 1, name: "Sam Wilson", position: "Main Referee", jersey_number: "7" },
          ],
        },
      ],
    };

    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <CourtSlotBox
        court={courtWithCrew}
        timeSlot={mockTimeSlot}
        isBlocked={false}
        assignmentType="crew"
      />
    );

    expect(screen.getByText("Crew Assigned")).toBeInTheDocument();
    expect(screen.getByText("Tigers Crew")).toBeInTheDocument();
    expect(screen.getByText(/2 members/i)).toBeInTheDocument();
    expect(screen.getByText("Sam Wilson")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: /remove crew/i });
    fireEvent.click(removeBtn);

    expect(Swal.fire).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockMutateRemove).toHaveBeenCalledWith(55);
    });
  });

  it("renders individual assigned referees and unassigned slots", () => {
    const courtWithRef = {
      ...mockCourtEmpty,
      assignments: [
        {
          type: "individual",
          id: 88,
          assignment_id: 88,
          referee_name: "Taylor Swift",
          jourcy_number: "13",
        },
      ],
      positions: [
        {
          id: 1,
          position: "Main Referee",
          is_assigned: true,
          referee: { id: 88, referee_name: "Taylor Swift", jourcy_number: "13" },
        },
        { id: 2, position: "Assistant Referee", is_assigned: false, referee: null },
      ],
    };

    const handleClick = vi.fn();

    render(
      <CourtSlotBox
        court={courtWithRef}
        timeSlot={mockTimeSlot}
        isBlocked={false}
        assignmentType="individual"
        onClick={handleClick}
      />
    );

    expect(screen.getByText("Taylor Swift")).toBeInTheDocument();
    expect(screen.getByText("#13")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Unassigned"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("toggles slot mode when clicking individual or crew mode toggle pills", () => {
    const handleToggleMode = vi.fn();

    render(
      <CourtSlotBox
        court={mockCourtEmpty}
        timeSlot={mockTimeSlot}
        isBlocked={false}
        assignmentType="individual"
        onToggleSlotMode={handleToggleMode}
      />
    );

    const crewModeBtn = screen.getByTitle("Switch to Crew Mode");
    fireEvent.click(crewModeBtn);

    expect(handleToggleMode).toHaveBeenCalledWith(201, "individual");
  });
});
