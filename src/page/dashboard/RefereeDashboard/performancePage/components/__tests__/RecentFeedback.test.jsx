import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RecentFeedback from "@/page/dashboard/RefereeDashboard/performancePage/components/RecentFeedback";

const mockGetMyEvaluationDetails = vi.fn();
vi.mock("@/services/referee-services/referee-performance.service", () => ({
  useRefereePerformanceService: () => ({
    getMyEvaluationDetails: mockGetMyEvaluationDetails,
  }),
}));

const feedbackList = [
  {
    id: 3609,
    camp_name: "Summer Officiating Camp",
    total_score: 49,
    max_score: 60,
    feedback: "Good mechanics",
    submitted_at: "Jun 25, 2026",
    evaluator_name: "Director1 User",
  },
  {
    id: 3242,
    camp_name: "Summer Officiating Camp",
    total_score: 6,
    max_score: 60,
    feedback: "Next evaluation",
    submitted_at: "Jun 20, 2026",
    evaluator_name: "Director1 User",
  },
];

const evaluation = {
  id: 3609,
  status: "submitted",
  submitted_at: "2026-06-25 01:29:36",
  submitted_at_formatted: "Jun 25, 2026",
  camp: {
    id: 1,
    name: "Summer Officiating Camp",
    location: "Vancouver, Canada",
    address: null,
    start_date: "2026-10-27T00:00:00.000000Z",
    end_date: "2026-10-28T00:00:00.000000Z",
    sports_type: { id: 10, name: "HS Basketball" },
  },
  evaluator: {
    id: 3,
    name: "Director1 User",
    role: "director",
    avatar: "/evaluator-photo.jpg",
    is_anonymous: false,
  },
  referee: {
    id: 11,
    name: "Referee1 One",
    email: "referee1@example.com",
    jersey_number: "321",
  },
  game_slot: null,
  performance_criteria: {
    call_accuracy: { score: 10, max_score: 10 },
    communication_skills: { score: 8, max_score: 10 },
    consistency_of_calls: { score: 6, max_score: 10 },
    court_position_mechanics: { score: 8, max_score: 10 },
    fitness_mobility: { score: 8, max_score: 10 },
    game_awareness: { score: 9, max_score: 10 },
  },
  scores: {
    total_score: 49,
    average_score: 8.17,
    max_total_score: 60,
    percentage: 81.67,
    rating: "Good",
  },
  recommended_levels: [{ sports_type_level_id: null, name: "HS", level: "HS" }],
  highest_recommended_level: "HS",
  referee_feedback: "Full feedback\nKeep working on consistency.",
  private_comments: "Never show director-only notes",
};

const response = (data = evaluation) => ({ data: { success: true, data } });
let queryClient;
const renderFeedback = (props = {}) => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0 } },
  });
  return render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <QueryClientProvider client={queryClient}>
        <RecentFeedback feedbackList={feedbackList} {...props} />
      </QueryClientProvider>
    </ConfigProvider>,
  );
};

describe("RecentFeedback evaluation details", () => {
  beforeEach(() => {
    mockGetMyEvaluationDetails.mockReset();
    mockGetMyEvaluationDetails.mockResolvedValue(response());
  });
  afterEach(() => queryClient?.clear());

  it("fetches the selected evaluation on demand and shows its scores, criteria, and feedback", async () => {
    const user = userEvent.setup();
    renderFeedback();
    expect(mockGetMyEvaluationDetails).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3609" }),
    );
    const dialog = within(await screen.findByRole("dialog"));
    expect(await dialog.findByText("8.170")).toBeInTheDocument();
    expect(mockGetMyEvaluationDetails).toHaveBeenCalledExactlyOnceWith(3609);
    expect(dialog.getByText("81.67%")).toBeInTheDocument();
    expect(dialog.getByText("Good", { exact: true })).toBeInTheDocument();
    expect(dialog.queryByText("Jersey #321")).not.toBeInTheDocument();
    expect(dialog.queryByText("referee1@example.com")).not.toBeInTheDocument();
    expect(dialog.queryByText("Director1 User")).not.toBeInTheDocument();
    expect(dialog.getByText("HS Basketball")).toBeInTheDocument();
    expect(
      dialog.queryByRole("region", { name: "Camp details" }),
    ).not.toBeInTheDocument();
    expect(
      dialog.queryByRole("region", { name: "Game details" }),
    ).not.toBeInTheDocument();
    expect(
      dialog.queryByRole("region", { name: "Recommended officiating levels" }),
    ).not.toBeInTheDocument();
    expect(
      dialog.getByRole("region", { name: "Written feedback" }),
    ).toHaveTextContent("Keep working on consistency.");
    expect(dialog.getAllByRole("meter")).toHaveLength(6);
    expect(
      dialog.getByRole("meter", { name: "Call / No Call Accuracy" }),
    ).toHaveAttribute("aria-valuenow", "10");
    expect(
      dialog.queryByText("Never show director-only notes"),
    ).not.toBeInTheDocument();
    await user.click(dialog.getByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it.each(["response", "camp"])(
    "keeps the evaluator anonymous when hidden by %s",
    async (source) => {
      const user = userEvent.setup();
      mockGetMyEvaluationDetails.mockResolvedValue(
        response({
          ...evaluation,
          evaluator: {
            ...evaluation.evaluator,
            is_anonymous: source === "response",
          },
        }),
      );
      renderFeedback({ hideEvaluatorName: source === "camp" });
      if (source === "camp")
        expect(
          screen.queryByText("Evaluator: Director1 User"),
        ).not.toBeInTheDocument();
      await user.click(
        screen.getByRole("button", {
          name: "View details for evaluation 3609",
        }),
      );
      const dialog = within(await screen.findByRole("dialog"));
      expect(await dialog.findByText("8.170")).toBeInTheDocument();
      expect(dialog.queryByText("Anonymous Evaluator")).not.toBeInTheDocument();
      expect(dialog.queryByText("Referee1 One")).not.toBeInTheDocument();
      expect(dialog.queryByText("Director1 User")).not.toBeInTheDocument();
      expect(
        dialog.queryByText("director", { exact: true }),
      ).not.toBeInTheDocument();
      expect(
        screen
          .getByRole("dialog")
          .querySelector('img[src="/evaluator-photo.jpg"]'),
      ).toBeNull();
    },
  );

  it("offers retry after a failed request and keeps failed details separate from empty data", async () => {
    const user = userEvent.setup();
    mockGetMyEvaluationDetails.mockRejectedValueOnce({
      response: { status: 404, data: { message: "Evaluation not available." } },
    });
    renderFeedback();
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3609" }),
    );
    const dialog = within(await screen.findByRole("dialog"));
    expect(await dialog.findByRole("alert")).toHaveTextContent(
      "Evaluation not available.",
    );
    expect(mockGetMyEvaluationDetails).toHaveBeenCalledTimes(1);
    await user.click(dialog.getByRole("button", { name: "Try again" }));
    expect(await dialog.findByText("8.170")).toBeInTheDocument();
    expect(mockGetMyEvaluationDetails).toHaveBeenCalledTimes(2);
  });

  it("supports zero scores, API-defined scales, and missing optional fields", async () => {
    const user = userEvent.setup();
    mockGetMyEvaluationDetails.mockResolvedValue(
      response({
        id: 3609,
        scores: {
          average_score: 0,
          total_score: 0,
          max_total_score: 5,
          percentage: 0,
        },
        performance_criteria: { call_accuracy: { score: 0, max_score: 5 } },
        game_slot: null,
        recommended_levels: [],
      }),
    );
    renderFeedback();
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3609" }),
    );
    const dialog = within(await screen.findByRole("dialog"));
    expect(await dialog.findByText("0%")).toBeInTheDocument();
    expect(dialog.getByText("0.000")).toBeInTheDocument();
    const meter = dialog.getByRole("meter", {
      name: "Call / No Call Accuracy",
    });
    expect(meter).toHaveAttribute("aria-valuenow", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "5");
    expect(
      dialog.getByText("No written feedback provided."),
    ).toBeInTheDocument();
    expect(dialog.queryByText(/NaN|Infinity/)).not.toBeInTheDocument();
  });

  it("omits game details even when supplied, and escapes feedback as plain text", async () => {
    const user = userEvent.setup();
    mockGetMyEvaluationDetails.mockResolvedValue(
      response({
        ...evaluation,
        game_slot: {
          id: 12442,
          game_date: "2026-05-08",
          start_time: "13:16:00",
          end_time: "14:16:00",
          court_name: "Court 1",
          timezone: "America/Chicago",
        },
        referee_feedback: "<script>window.bad = true</script>",
      }),
    );
    renderFeedback();
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3609" }),
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      await within(dialog).findByText("<script>window.bad = true</script>"),
    ).toBeInTheDocument();
    expect(within(dialog).queryByText("Court 1")).not.toBeInTheDocument();
    expect(within(dialog).queryByText("CDT")).not.toBeInTheDocument();
    expect(dialog.querySelector("script")).toBeNull();
  });

  it("does not show stale details when opening another evaluation while the first request is pending", async () => {
    const user = userEvent.setup();
    let resolveFirst;
    mockGetMyEvaluationDetails.mockImplementation((id) =>
      id === 3609
        ? new Promise((resolve) => {
            resolveFirst = resolve;
          })
        : Promise.resolve(
            response({
              ...evaluation,
              id: 3242,
              referee_feedback: "Second evaluation details",
            }),
          ),
    );
    renderFeedback();
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3609" }),
    );
    await screen.findByText("Loading evaluation details…");
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Done" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await user.click(
      screen.getByRole("button", { name: "View details for evaluation 3242" }),
    );
    const dialog = within(await screen.findByRole("dialog"));
    expect(
      await dialog.findByText("Second evaluation details"),
    ).toBeInTheDocument();
    await act(async () => resolveFirst(response()));
    expect(
      dialog.queryByText("Keep working on consistency.", { exact: false }),
    ).not.toBeInTheDocument();
    expect(dialog.getByText("Second evaluation details")).toBeInTheDocument();
  });

  it("supports keyboard opening, Escape dismissal, and returning focus to the feedback button", async () => {
    const user = userEvent.setup();
    renderFeedback();
    const button = screen.getByRole("button", {
      name: "View details for evaluation 3609",
    });
    button.focus();
    await user.keyboard("{Enter}");
    const dialog = within(await screen.findByRole("dialog"));
    await dialog.findByText("8.170");
    dialog.getByRole("button", { name: "Done" }).focus();
    // Ant Design's dialog listens to the browser's legacy Escape keyCode.
    fireEvent.keyDown(dialog.getByRole("button", { name: "Done" }), {
      key: "Escape",
      keyCode: 27,
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(button).toHaveFocus();
    expect(mockGetMyEvaluationDetails).toHaveBeenCalledTimes(1);
  });

  it("keeps the no-feedback state without requesting details", () => {
    renderFeedback({ feedbackList: [] });
    expect(
      screen.getByText("No feedback comments available yet for this camp."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /View details/ }),
    ).not.toBeInTheDocument();
    expect(mockGetMyEvaluationDetails).not.toHaveBeenCalled();
  });
});
