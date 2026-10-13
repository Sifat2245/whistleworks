import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CampCard from "../CampCard";

vi.mock("@/hooks/useCampSchedule", () => ({
  default: () => ({
    scheduleData: { status: "published" },
  }),
}));

describe("CampCard Component", () => {
  const mockLeague = {
    camp_id: 13,
    camp_name: "Summer Elite Camp",
    camp_logo: "https://example.com/logo.png",
    location: "Orlando, FL",
    status: "active",
    total_referees: 24,
    total_courts: 4,
  };

  it("renders camp details, stats and action buttons accurately", () => {
    render(
      <MemoryRouter>
        <CampCard league={mockLeague} />
      </MemoryRouter>
    );

    expect(screen.getByText("Summer Elite Camp")).toBeInTheDocument();
    expect(screen.getByText("Orlando, FL")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Referees")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("published")).toBeInTheDocument();

    // Verify Evaluation action button
    const evalButton = screen.getByText("Evaluation");
    expect(evalButton).toBeInTheDocument();
    const evalLink = evalButton.closest("a");
    expect(evalLink).toHaveAttribute(
      "href",
      "/director-dashboard/evaluation/13"
    );
  });
});
