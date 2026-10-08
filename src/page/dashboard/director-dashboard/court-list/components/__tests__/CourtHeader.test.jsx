import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CourtHeader from "../CourtHeader";

const mockCampData = {
  id: 101,
  camp_name: "Texas Elite Camp",
};

const mockScheduleData = {
  status: "published",
  game_duration: 50,
  total_game_slots: 16,
  max_referees_per_slot: 2,
  assigned_slots: 8,
  available_slots: 8,
  blocked_slots: 0,
  created_at: "2026-05-01T10:00:00Z",
  time_ranges: [],
};

describe("CourtHeader Component", () => {
  it("renders camp schedule title, description and action button", () => {
    render(
      <CourtHeader
        campData={mockCampData}
        scheduleData={mockScheduleData}
        isLoading={false}
      />
    );

    expect(screen.getByText("Schedule - Texas Elite Camp")).toBeInTheDocument();
    expect(
      screen.getByText("Manage games, locations, and referee assignments")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /schedule details/i })
    ).toBeInTheDocument();
  });

  it("opens CourtDetailsModal when clicking Schedule Details button", () => {
    render(
      <CourtHeader
        campData={mockCampData}
        scheduleData={mockScheduleData}
        isLoading={false}
      />
    );

    expect(screen.queryByText("Court Schedule Details")).not.toBeInTheDocument();

    const detailsBtn = screen.getByRole("button", {
      name: /schedule details/i,
    });
    fireEvent.click(detailsBtn);

    expect(screen.getByText("Court Schedule Details")).toBeInTheDocument();
    expect(screen.getByText("50 min")).toBeInTheDocument();
  });
});
