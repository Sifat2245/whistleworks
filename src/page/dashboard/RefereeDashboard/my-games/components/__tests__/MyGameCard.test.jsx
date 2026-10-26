import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MyGameCard from "../MyGameCard";

const mockCamp = {
  id: 1,
  name: "TEST- DO NOT REGISTER",
  timezone: "America/Chicago",
  location: "Vancouver, BC, Canada",
};

const mockGame = {
  game_slot_id: 12171,
  assignment_source: "individual",
  my_position: "assistent",
  game_details: {
    date: "2026-05-08",
    start_time: "12:45:00",
    end_time: "13:45:00",
    court_name: "Court 1",
    court_number: 1,
    status: "assigned",
  },
  location: {
    id: 184,
    name: "Titumir Govt. College Rd, Dhaka 1212, Bangladesh",
    address: "Titumir College",
    latitude: "23.7818898",
    longitude: "90.4038511",
  },
  assigned_referees: {
    total: 2,
    referees: [
      {
        id: 11,
        name: "Referee1 One",
        position: "assistent",
        is_me: true,
      },
      {
        id: 19,
        name: "Referee9 Nine",
        position: "main refeeree",
        is_me: false,
      },
    ],
  },
};

vi.mock("@/hooks/api/useRefereeDetails", () => ({
  useGetRefereeDetails: () => ({
    refereeDetails: null,
    isLoading: false,
  }),
}));

describe("MyGameCard Component", () => {
  it.each(["upcoming", "ongoing", "past"])(
    "labels the card using the API's %s filter",
    (status) => {
      render(
        <MyGameCard game={mockGame} camp={mockCamp} scheduleStatus={status} />,
      );
      expect(screen.getByText(status, { exact: false })).toBeInTheDocument();
      expect(
        screen.queryByText("assigned", { exact: true }),
      ).not.toBeInTheDocument();
    },
  );

  it("formats date and time accurately in camp timezone (May 8, 2026) without local browser timezone shift", () => {
    render(<MyGameCard game={mockGame} camp={mockCamp} />);

    // Date must be Friday, May 8, 2026 (never Thursday, May 7)
    expect(screen.getByText("Friday, May 8, 2026")).toBeInTheDocument();

    // Time must be 12:45 PM CDT – 1:45 PM CDT
    expect(screen.getByText("12:45 PM")).toBeInTheDocument();
    expect(screen.getByText("1:45 PM")).toBeInTheDocument();
    expect(screen.getAllByText("CDT")).toHaveLength(2);
    expect(screen.getAllByTitle("Timezone: America/Chicago")).toHaveLength(2);
  });

  it("prefers the game's timezone when it differs from the camp", () => {
    render(
      <MyGameCard
        game={{
          ...mockGame,
          game_details: {
            ...mockGame.game_details,
            timezone: "America/New_York",
          },
        }}
        camp={mockCamp}
      />,
    );
    expect(screen.getAllByText("EDT")).toHaveLength(2);
    expect(screen.queryByText("CDT")).not.toBeInTheDocument();
    expect(screen.getByText("12:45 PM")).toBeInTheDocument();
  });

  it("uses the game date to distinguish daylight and standard time", () => {
    render(
      <MyGameCard
        game={{
          ...mockGame,
          game_details: { ...mockGame.game_details, date: "2026-01-08" },
        }}
        camp={mockCamp}
      />,
    );
    expect(screen.getAllByText("CST")).toHaveLength(2);
    expect(screen.getByText("12:45 PM")).toBeInTheDocument();
  });

  it("does not invent a timezone when neither the game nor camp supplies one", () => {
    render(
      <MyGameCard
        game={mockGame}
        camp={{ ...mockCamp, timezone: undefined }}
      />,
    );
    expect(screen.queryByTitle(/Timezone:/)).not.toBeInTheDocument();
    expect(screen.getByText("Friday, May 8, 2026")).toBeInTheDocument();
    expect(screen.getByText("12:45 PM")).toBeInTheDocument();
  });

  it("renders camp name, court, and position details", () => {
    render(<MyGameCard game={mockGame} camp={mockCamp} />);

    expect(screen.getByText("TEST- DO NOT REGISTER")).toBeInTheDocument();
    expect(screen.getByText("Court 1")).toBeInTheDocument();
    expect(screen.getByText("Titumir College")).toBeInTheDocument();
    expect(
      screen.getAllByText("Assistant Referee").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Referee1 One")).toBeInTheDocument();
    expect(screen.getByText("Referee9 Nine")).toBeInTheDocument();
  });

  it("opens Google Maps location when clicking Location button", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});
    render(<MyGameCard game={mockGame} camp={mockCamp} />);

    const locationBtn = screen.getByRole("button", { name: /location/i });
    fireEvent.click(locationBtn);

    expect(openSpy).toHaveBeenCalledWith(
      "https://www.google.com/maps/search/?api=1&query=23.7818898,90.4038511",
      "_blank",
    );
    openSpy.mockRestore();
  });
});
