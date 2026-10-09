import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import RefereeAssignModal from "../RefereeAssignModal";

const mockMutateReferees = vi.fn();

const mockReferees = [
  {
    id: 101,
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "555-0101",
    jersey_number: "12",
    total_assignments: 1,
    status: "available",
    can_assign: true,
  },
  {
    id: 102,
    name: "Sarah Miller",
    email: "sarah@example.com",
    phone: "555-0102",
    jersey_number: "24",
    total_assignments: 3,
    status: "needs_rest",
    can_assign: true,
    is_assigned_to_this_court: true,
  },
  {
    id: 103,
    name: "David Clark",
    email: "david@example.com",
    phone: "555-0103",
    jersey_number: "36",
    total_assignments: 2,
    status: "time_conflict",
    can_assign: false,
    status_message: "Assigned to another court at this time",
  },
];

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useAvailableReferees: () => ({
    data: mockReferees,
    isLoading: false,
  }),
  useAssignReferees: ({ onSuccess } = {}) => ({
    mutate: (payload) => {
      mockMutateReferees(payload);
      onSuccess?.();
    },
    isPending: false,
  }),
}));

const mockCourt = {
  slot_id: 5001,
  court_number: 2,
  address: "North Gymnasium",
  assignments: [],
  positions: [
    { id: 1, position: "Main Referee", is_assigned: false, referee: null },
    { id: 2, position: "Assistant Referee", is_assigned: false, referee: null },
  ],
};

const mockTimeSlot = {
  time: "10:30 AM",
};

describe("RefereeAssignModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal header with court number, address, and court positions bar", () => {
    render(
      <RefereeAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        maxReferees={2}
      />
    );

    expect(screen.getByText("Assign to Court 2")).toBeInTheDocument();
    expect(screen.getByText(/10:30 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/North Gymnasium/i)).toBeInTheDocument();
    expect(screen.getByText(/Court Positions \(0\/2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Alex Johnson #12")).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller #24")).toBeInTheDocument();
  });

  it("filters referees when typing in search bar", () => {
    render(
      <RefereeAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        maxReferees={2}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by name or email/i);
    fireEvent.change(searchInput, { target: { value: "Alex" } });

    expect(screen.getByText("Alex Johnson #12")).toBeInTheDocument();
    expect(screen.queryByText("Sarah Miller #24")).not.toBeInTheDocument();
  });

  it("selects referee on click, assigns to first empty position slot, and submits", () => {
    const handleSuccess = vi.fn();
    render(
      <RefereeAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        maxReferees={2}
        onAssignSuccess={handleSuccess}
      />
    );

    fireEvent.click(screen.getByText("Alex Johnson #12"));

    expect(screen.getByText(/Court Positions \(1\/2\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /assign referees \(1\/2\)/i })).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", {
      name: /assign referees \(1\/2\)/i,
    });
    fireEvent.click(submitBtn);

    expect(mockMutateReferees).toHaveBeenCalledWith({
      slotId: 5001,
      payload: {
        override_restrictions: 1,
        assignments: [{ referee_ids: 101, position_ids: 1 }],
      },
    });
    expect(handleSuccess).toHaveBeenCalled();
  });

  it("shows rest/fatigue warning dialog when assigning a referee with soft conflict", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <RefereeAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        maxReferees={2}
      />
    );

    fireEvent.click(screen.getByText("Sarah Miller #24"));

    const submitBtn = screen.getByRole("button", {
      name: /assign referees \(1\/2\) fatigue risk/i,
    });
    fireEvent.click(submitBtn);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Fatigue & Rest Restriction Warning",
      })
    );
    await waitFor(() => {
      expect(mockMutateReferees).toHaveBeenCalled();
    });
  });

  it("unassigns a selected referee when clicking the referee item again", () => {
    render(
      <RefereeAssignModal
        isModalOpen={true}
        handleCloseModal={vi.fn()}
        selectedCourt={mockCourt}
        selectedTimeSlot={mockTimeSlot}
        campId={1}
        maxReferees={2}
      />
    );

    const refItem = screen.getByText("Alex Johnson #12");
    fireEvent.click(refItem);
    expect(screen.getByText(/Court Positions \(1\/2\)/i)).toBeInTheDocument();

    fireEvent.click(refItem);
    expect(screen.getByText(/Court Positions \(0\/2\)/i)).toBeInTheDocument();
  });
});
