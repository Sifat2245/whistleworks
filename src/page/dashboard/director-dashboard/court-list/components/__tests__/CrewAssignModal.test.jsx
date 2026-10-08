import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import CrewAssignModal from "../CrewAssignModal";

const mockMutateCrew = vi.fn();

const mockCrews = [
  {
    id: 10,
    name: "Crew Alpha",
    status: "active",
    member_count: 3,
    can_assign: true,
    members: [
      { id: 1, name: "John Ref", position: "Main Referee", jersey_number: "44" },
      { id: 2, name: "Sarah Ref", position: "Assistant", jersey_number: "22" },
    ],
  },
  {
    id: 20,
    name: "Crew Beta",
    status: "inactive",
    member_count: 2,
    can_assign: false,
    status_message: "Crew Beta has a time conflict",
    members: [
      { id: 3, name: "Mike Ref", position: "Main Referee" },
    ],
  },
];

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useAvailableCrews: () => ({
    data: mockCrews,
    isLoading: false,
  }),
  useAssignCrew: ({ onSuccess } = {}) => ({
    mutate: (payload) => {
      mockMutateCrew(payload);
      onSuccess?.();
    },
    isPending: false,
  }),
}));

const mockCourt = {
  slot_id: 1001,
  court_number: 1,
  address: "Main Gym Court",
  assignments: [],
  positions: [
    { id: 1, position: "Main Referee", is_assigned: false },
    { id: 2, position: "Assistant", is_assigned: false },
  ],
};

const mockTimeSlot = {
  time: "09:00 AM",
};

describe("CrewAssignModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal header with court number, time slot and address", () => {
    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
      />
    );

    expect(screen.getByText("Assign Crew to Court 1")).toBeInTheDocument();
    expect(screen.getByText(/09:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Main Gym Court/i)).toBeInTheDocument();
    expect(screen.getByText("Crew Alpha")).toBeInTheDocument();
    expect(screen.getByText("Crew Beta")).toBeInTheDocument();
  });

  it("selects a crew on click and enables the assign button", () => {
    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
      />
    );

    const assignBtn = screen.getByRole("button", {
      name: /select a crew/i,
    });
    expect(assignBtn).toBeDisabled();

    fireEvent.click(screen.getByText("Crew Alpha"));

    expect(
      screen.getByRole("button", { name: /assign selected crew/i })
    ).not.toBeDisabled();
  });

  it("submits assignment when clicking Assign Selected Crew button", () => {
    const handleSuccess = vi.fn();
    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        onAssignSuccess={handleSuccess}
      />
    );

    fireEvent.click(screen.getByText("Crew Alpha"));
    const assignBtn = screen.getByRole("button", {
      name: /assign selected crew/i,
    });
    fireEvent.click(assignBtn);

    expect(mockMutateCrew).toHaveBeenCalledWith({
      slotId: 1001,
      data: { crew_id: 10 },
    });
    expect(handleSuccess).toHaveBeenCalled();
  });

  it("shows warning when selecting a crew with conflicts, and assigns on confirm", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
      />
    );

    fireEvent.click(screen.getByText("Crew Beta"));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Potential Conflict Detected",
      })
    );
  });

  it("displays warning banner when individual referees are already assigned", () => {
    const courtWithIndividualRefs = {
      ...mockCourt,
      assignments: [
        { type: "individual", referee_id: 5, name: "Assigned Ref" },
      ],
      positions: [
        { id: 1, position: "Main", is_assigned: true, referee: { id: 5 } },
      ],
    };

    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={courtWithIndividualRefs}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
      />
    );

    expect(
      screen.getByText("Individual Referees Already Assigned")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /individuals already assigned/i })
    ).toBeDisabled();
  });

  it("triggers handleBlockCourt and handleCloseModal buttons", () => {
    const handleClose = vi.fn();
    const handleBlock = vi.fn();

    render(
      <CrewAssignModal
        isModalOpen={true}
        handleCloseModal={handleClose}
        handleBlockCourt={handleBlock}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /block court/i }));
    expect(handleBlock).toHaveBeenCalled();
  });
});
