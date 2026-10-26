import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refereeGameKeys } from "@/hooks/api/referee-hooks/useRefereeGames";
import MyGames from "@/page/dashboard/RefereeDashboard/my-games/MyGames";

const mockGetAssignedSlots = vi.fn();

vi.mock("@/services/referee-services/my-games.service", () => ({
  useRefereeGamesService: () => ({
    getAssignedSlots: mockGetAssignedSlots,
  }),
}));

vi.mock(
  "@/page/dashboard/RefereeDashboard/my-games/components/MyGameCard",
  () => ({
    default: ({ game, scheduleStatus }) => (
      <article
        aria-label={game.game_details.court_name}
        data-status={scheduleStatus}
      >
        {game.game_details.court_name}
      </article>
    ),
  }),
);

const unpublishedBody = {
  status: false,
  message: "This camp schedule is not published yet!",
  data: null,
  code: 403,
};

let queryClient;

const renderGames = (campId = 1) => {
  // Keep production retry defaults: a 403 must settle without waiting/retrying.
  queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyGames camp_id={campId} />
    </QueryClientProvider>,
  );
};

describe("MyGames unpublished schedule", () => {
  beforeEach(() => {
    mockGetAssignedSlots.mockReset();
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it("shows the unpublished notice after a single HTTP 403 response", async () => {
    mockGetAssignedSlots.mockRejectedValue({
      response: { status: 403, data: unpublishedBody },
    });

    const { container } = renderGames();

    expect(
      await screen.findByRole("heading", { name: "Schedule Not Published" }),
    ).toBeInTheDocument();
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(1);
    expect(mockGetAssignedSlots).toHaveBeenCalledWith(1, 1, "upcoming");
    expect(
      container.querySelector(".ant-spin-spinning"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("No Game Assignments Found"),
    ).not.toBeInTheDocument();
  });

  it("handles code 403 in a failure body even when HTTP returns 200", async () => {
    mockGetAssignedSlots.mockResolvedValue({
      status: 200,
      data: unpublishedBody,
    });

    renderGames();

    expect(
      await screen.findByRole("heading", { name: "Schedule Not Published" }),
    ).toBeInTheDocument();
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(1);
  });

  it("can fetch games again after the director publishes the schedule", async () => {
    mockGetAssignedSlots.mockRejectedValueOnce({
      response: { status: 403, data: unpublishedBody },
    });
    renderGames();
    await screen.findByRole("heading", { name: "Schedule Not Published" });

    mockGetAssignedSlots.mockResolvedValue({
      data: {
        status: true,
        data: {
          game_slots: [
            {
              game_slot_id: 42,
              game_details: {
                date: "2026-05-08",
                start_time: "13:16:00",
                court_name: "Court 1",
              },
            },
          ],
          pagination: { total: 1 },
        },
      },
    });

    await act(async () => {
      await queryClient.invalidateQueries({
        queryKey: refereeGameKeys.assignedSlots(1, 1),
      });
    });

    expect(await screen.findByText("Court 1")).toBeInTheDocument();
    expect(
      screen.queryByText("Schedule Not Published"),
    ).not.toBeInTheDocument();
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(2);
  });

  it("keeps the empty state for a published schedule without assignments", async () => {
    mockGetAssignedSlots.mockResolvedValue({
      data: { status: true, data: { game_slots: [] } },
    });

    renderGames();

    expect(
      await screen.findByRole("heading", { name: "No upcoming games" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Schedule Not Published"),
    ).not.toBeInTheDocument();
  });

  it("does not label an unrelated permission error as an unpublished schedule", async () => {
    mockGetAssignedSlots.mockRejectedValue({
      response: {
        status: 403,
        data: { ...unpublishedBody, message: "Access denied." },
      },
    });

    renderGames();

    await screen.findByRole("heading", { name: "Unable to load games" });
    expect(screen.getByRole("alert")).toHaveTextContent("Access denied.");
    expect(
      screen.queryByText("Schedule Not Published"),
    ).not.toBeInTheDocument();
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(1);
  });
});

const gameResponse = (status, page = 1) => ({
  data: {
    success: true,
    data: {
      game_slots: [
        {
          game_slot_id: status + page,
          game_details: {
            date: "2026-05-08",
            start_time: "13:00:00",
            court_name: status + " court " + page,
          },
        },
      ],
      pagination: { total: 31, per_page: 15, current_page: page },
      statistics: {
        total_assigned_slots: 31,
        upcoming_slots: 20,
        completed_slots: 11,
      },
    },
  },
});

describe("MyGames status filters", () => {
  beforeEach(() => {
    mockGetAssignedSlots.mockReset();
    mockGetAssignedSlots.mockImplementation((_campId, page, status) =>
      Promise.resolve(gameResponse(status, page)),
    );
  });

  afterEach(() => queryClient?.clear());

  it("starts with Upcoming and requests Ongoing and Past only when selected", async () => {
    const user = userEvent.setup();
    renderGames();
    expect(
      screen.getByRole("group", { name: "Filter games by status" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upcoming" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await screen.findByRole("article", { name: "upcoming court 1" }),
    ).toHaveAttribute("data-status", "upcoming");
    expect(mockGetAssignedSlots).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Ongoing" }));
    expect(
      await screen.findByRole("article", { name: "ongoing court 1" }),
    ).toHaveAttribute("data-status", "ongoing");
    expect(
      screen.queryByRole("article", { name: "upcoming court 1" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Past" }));
    expect(
      await screen.findByRole("article", { name: "past court 1" }),
    ).toHaveAttribute("data-status", "past");
    expect(mockGetAssignedSlots.mock.calls).toEqual([
      [1, 1, "upcoming"],
      [1, 1, "ongoing"],
      [1, 1, "past"],
    ]);
  });

  it("resets pagination when the filter changes and sends status on later pages", async () => {
    const user = userEvent.setup();
    renderGames();
    await screen.findByRole("article", { name: "upcoming court 1" });
    await user.click(screen.getByTitle("2"));
    await screen.findByRole("article", { name: "upcoming court 2" });
    expect(mockGetAssignedSlots).toHaveBeenLastCalledWith(1, 2, "upcoming");

    await user.click(screen.getByRole("button", { name: "Past" }));
    await screen.findByRole("article", { name: "past court 1" });
    expect(mockGetAssignedSlots).toHaveBeenLastCalledWith(1, 1, "past");
    expect(mockGetAssignedSlots).not.toHaveBeenCalledWith(1, 2, "past");
    await user.click(screen.getByTitle("2"));
    await screen.findByRole("article", { name: "past court 2" });
    expect(mockGetAssignedSlots).toHaveBeenLastCalledWith(1, 2, "past");
  });

  it.each([
    ["Upcoming", "No upcoming games"],
    ["Ongoing", "No games in progress"],
    ["Past", "No past games yet"],
  ])(
    "keeps filters available for an empty %s category",
    async (label, heading) => {
      const user = userEvent.setup();
      mockGetAssignedSlots.mockResolvedValue({
        data: {
          success: true,
          data: { game_slots: [], pagination: { total: 0 } },
        },
      });
      renderGames();
      await user.click(screen.getByRole("button", { name: label }));
      expect(
        await screen.findByRole("heading", { name: heading }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Upcoming" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Ongoing" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Past" })).toBeEnabled();
      expect(
        screen.queryByText("31 total assigned games"),
      ).not.toBeInTheDocument();
    },
  );

  it("does not display stale or late responses from another category", async () => {
    const user = userEvent.setup();
    let resolvePast;
    let resolveOngoing;
    mockGetAssignedSlots.mockImplementation((_campId, _page, status) => {
      if (status === "past")
        return new Promise((resolve) => {
          resolvePast = resolve;
        });
      if (status === "ongoing")
        return new Promise((resolve) => {
          resolveOngoing = resolve;
        });
      return Promise.resolve(gameResponse(status));
    });
    renderGames();
    await screen.findByRole("article", { name: "upcoming court 1" });
    await user.click(screen.getByRole("button", { name: "Past" }));
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Past" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Ongoing" }));

    await act(async () => resolvePast(gameResponse("past")));
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ongoing games" }),
    ).toBeInTheDocument();
    await act(async () => resolveOngoing(gameResponse("ongoing")));
    expect(
      await screen.findByRole("article", { name: "ongoing court 1" }),
    ).toBeInTheDocument();
  });

  it("supports keyboard selection and refreshing the selected category", async () => {
    const user = userEvent.setup();
    renderGames();
    await screen.findByRole("article", { name: "upcoming court 1" });
    screen.getByRole("button", { name: "Past" }).focus();
    await user.keyboard(" ");
    await screen.findByRole("article", { name: "past court 1" });
    expect(screen.getByRole("button", { name: "Past" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(mockGetAssignedSlots).toHaveBeenCalledTimes(3));
    expect(mockGetAssignedSlots).toHaveBeenLastCalledWith(1, 1, "past");
  });

  it("shows supplied counts, including zero, without inventing missing counts", async () => {
    const response = gameResponse("upcoming");
    response.data.data.statistics = { upcoming_slots: 7, ongoing_slots: 0 };
    mockGetAssignedSlots.mockResolvedValue(response);
    renderGames();
    await screen.findByRole("article", { name: "upcoming court 1" });

    expect(screen.getByRole("button", { name: "Upcoming" })).toHaveTextContent(
      "7",
    );
    expect(screen.getByRole("button", { name: "Ongoing" })).toHaveTextContent(
      "0",
    );
    expect(screen.getByRole("button", { name: "Past" })).toHaveTextContent(
      /^Past$/,
    );
    expect(screen.queryByText(/total assigned games/)).not.toBeInTheDocument();
  });

  it.each([
    ["Upcoming", ["Earlier game", "Later game"]],
    ["Past", ["Later game", "Earlier game"]],
  ])(
    "orders the returned %s page for easy scanning",
    async (label, expectedOrder) => {
      const user = userEvent.setup();
      mockGetAssignedSlots.mockResolvedValue({
        data: {
          data: {
            game_slots: [
              {
                game_slot_id: 1,
                game_details: {
                  date: "2026-05-09",
                  start_time: "10:00:00",
                  court_name: "Later game",
                },
              },
              {
                game_slot_id: 2,
                game_details: {
                  date: "2026-05-08",
                  start_time: "10:00:00",
                  court_name: "Earlier game",
                },
              },
            ],
          },
        },
      });
      renderGames();
      await user.click(screen.getByRole("button", { name: label }));
      await screen.findByRole("article", { name: "Earlier game" });
      expect(
        screen.getAllByRole("article").map((card) => card.textContent),
      ).toEqual(expectedOrder);
    },
  );

  it("resets the view for a different camp without requesting its old page or status", async () => {
    const user = userEvent.setup();
    const view = renderGames();
    await screen.findByRole("article", { name: "upcoming court 1" });
    await user.click(screen.getByRole("button", { name: "Past" }));
    await screen.findByRole("article", { name: "past court 1" });
    await user.click(screen.getByTitle("2"));
    await screen.findByRole("article", { name: "past court 2" });

    view.rerender(
      <QueryClientProvider client={queryClient}>
        <MyGames camp_id={2} />
      </QueryClientProvider>,
    );
    await screen.findByRole("article", { name: "upcoming court 1" });
    expect(mockGetAssignedSlots).toHaveBeenLastCalledWith(2, 1, "upcoming");
    expect(mockGetAssignedSlots).not.toHaveBeenCalledWith(2, 2, "past");
    expect(screen.getByRole("button", { name: "Upcoming" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
