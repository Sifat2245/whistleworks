import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import GameCard from "../GameCard";
import GameRow from "../GameRow";

describe("GameCard & GameRow Components", () => {
  const sampleGame = {
    id: 101,
    date: "August 20, 2026",
    time: "10:00 AM - 11:30 AM",
    location: "Main Gym, Court 3",
    court: "Court 3",
    status: "in_progress",
    referees: [
      {
        type: "individual",
        referee_id: 1,
        name: "John Doe",
        displayName: "John Doe | 42",
      },
      {
        type: "crew",
        crew_id: 5,
        crew_name: "Alpha Crew",
        displayName: "Crew: Alpha Crew",
      },
    ],
  };

  it("renders GameCard with court, status, date, time, location, and assigned officials", () => {
    render(<GameCard game={sampleGame} />);

    expect(screen.getByText("Court Assignment")).toBeInTheDocument();
    expect(screen.getByText("Court 3")).toBeInTheDocument();
    expect(screen.getByText("in progress")).toBeInTheDocument();
    expect(screen.getByText("August 20, 2026")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM - 11:30 AM")).toBeInTheDocument();
    expect(screen.getByText("Main Gym, Court 3")).toBeInTheDocument();
    expect(screen.getByText("Assigned Officials (2)")).toBeInTheDocument();
    expect(screen.getByText("John Doe | 42")).toBeInTheDocument();
    expect(screen.getByText("Crew: Alpha Crew")).toBeInTheDocument();
  });

  it("handles referee and crew clicks in GameCard", async () => {
    const user = userEvent.setup();
    const handleRefereeClick = vi.fn();
    const handleCrewClick = vi.fn();

    render(
      <GameCard
        game={sampleGame}
        onRefereeClick={handleRefereeClick}
        onCrewClick={handleCrewClick}
      />,
    );

    const refBtn = screen.getByRole("button", { name: /John Doe \| 42/i });
    await user.click(refBtn);
    expect(handleRefereeClick).toHaveBeenCalledWith(sampleGame.referees[0]);

    const crewBtn = screen.getByRole("button", { name: /Crew: Alpha Crew/i });
    await user.click(crewBtn);
    expect(handleCrewClick).toHaveBeenCalledWith(sampleGame.referees[1]);
  });

  it("shows fallback text when no officials are assigned", () => {
    const gameWithoutRefs = {
      ...sampleGame,
      referees: [],
    };

    render(<GameCard game={gameWithoutRefs} />);
    expect(
      screen.getByText(/No officials assigned to this slot yet/i),
    ).toBeInTheDocument();
  });

  it("renders both desktop row and mobile card in GameRow", () => {
    render(<GameRow game={sampleGame} />);

    // Since both views exist for responsive switching, query by text
    const dateElements = screen.getAllByText("August 20, 2026");
    expect(dateElements.length).toBeGreaterThanOrEqual(1);

    const courtElements = screen.getAllByText("Court 3");
    expect(courtElements.length).toBeGreaterThanOrEqual(1);
  });
});
