import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiDirectorAssistant from "@/page/dashboard/director-dashboard/ai-assistant/AiDirectorAssistant";

const api = vi.hoisted(() => ({
  camps: vi.fn(),
  participants: vi.fn(),
  quota: vi.fn(),
  send: vi.fn(),
  sessions: vi.fn(),
  history: vi.fn(),
  rename: vi.fn(),
  chart: vi.fn(),
  destroyChart: vi.fn(),
}));
vi.mock("@/services/director-services/ai-chat.service", () => ({
  useAiChatService: () => ({
    getAiCamps: api.camps,
    getAiParticipants: api.participants,
    getAiQuota: api.quota,
    sendAiChat: api.send,
    getAiSessions: api.sessions,
    getSessionHistory: api.history,
    renameAiSession: api.rename,
  }),
}));
vi.mock("framer-motion", async (original) => ({
  ...(await original()),
  useReducedMotion: () => true,
}));
vi.mock("chart.js/auto", () => ({
  default: class {
    constructor(...args) {
      api.chart(...args);
    }
    destroy() {
      api.destroyChart();
    }
  },
}));
const envelope = (data) => ({ data: { success: true, data } });
const session = {
  session_uuid: "saved-session",
  title: "Saved comparison",
  messages_count: 2,
  last_message: { content: "Evaluation comparison" },
  last_interaction_at: "2026-10-13T07:10:20+00:00",
};
const chartPayload = {
  title: "Performance comparison",
  chart_type: "line",
  labels: ["Accuracy", "Mechanics"],
  y_axis: { min: 0, max: 10, title: "Score" },
  datasets: [
    { label: "Marcus Johnson", data: [6.83, 7.67] },
    { label: "David Rivera", data: [0, 0] },
  ],
};
const excelResponse = {
  session_uuid: "aaea595c-15d3-4d25-94d4-9c4c1c0700c8",
  session_title: "hi\r\n\r\nAcross all my camps.",
  role: "assistant",
  content:
    "I have compiled the ranking report for **@TEST- DO NOT REGISTER (ID: 16)**.\n\n### Camp Ranking Summary\n\n| Rank | Name | Avg Score |\n| --- | --- | --- |\n| 1 | Referee1 User | 9.83 |\n\n**Download Report:** [camp_rankings.xlsx](https://super-admin.whistleworks.org/storage/ai_exports/camp_rankings.xlsx) (7.8 KB)",
  widget_type: "excel_download",
  widget_payload: {
    type: "excel_download",
    title: "Camp Rankings Spreadsheet (.xlsx)",
    download_url:
      "https://super-admin.whistleworks.org/storage/ai_exports/camp_rankings.xlsx",
    filename: "camp_rankings.xlsx",
    file_size: "7.8 KB",
    camps_included: ["TEST- DO NOT REGISTER"],
    total_ranked_referees: 1,
    preview_headers: ["Rank", "Camp", "Referee", "Avg Score", "Evals"],
    preview_rows: [
      {
        rank: "#1",
        camp: "TEST- DO NOT REGISTER",
        name: "Referee1 User",
        score: "9.83",
        evals: 1,
      },
    ],
  },
  tools_called: ["compile_camp_rankings_excel"],
};
function NavigationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="Conversation URL">
        {location.pathname + location.search}
      </output>
      <button onClick={() => navigate(-1)}>Browser Back</button>
      <button onClick={() => navigate(1)}>Browser Forward</button>
    </>
  );
}
function renderAssistant(entries = ["/director-dashboard/ai-assistant"]) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={entries}>
        <AiDirectorAssistant />
        <NavigationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
async function send(user, text) {
  await user.type(
    screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
    text,
  );
  await user.click(screen.getByRole("button", { name: "Send message" }));
}
async function openHistory(user) {
  await user.click(screen.getByRole("button", { name: "History" }));
  return screen.findByRole("button", {
    name: "Open conversation: Saved comparison",
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  URL.createObjectURL = vi.fn(() => "blob:report");
  URL.revokeObjectURL = vi.fn();
  api.camps.mockResolvedValue(
    envelope([
      { id: 15, name: "Midwest Elite Summit" },
      { id: 16, name: "Great Lakes Ref Camp" },
    ]),
  );
  api.participants.mockImplementation(({ role }) =>
    Promise.resolve(
      envelope(
        role === "referee"
          ? [
              { id: 104, name: "Marcus Johnson", role },
              { id: 208, name: "David Rivera", role },
            ]
          : [{ id: 1, name: "Greg Vance", role }],
      ),
    ),
  );
  api.quota.mockResolvedValue(
    envelope({
      plan_tier: "free",
      monthly_query_limit: 50,
      queries_used_this_month: 1,
      remaining_queries: 49,
      tokens_used_this_month: 1690,
      quota_resets_at: "2026-11-10T00:00:00+00:00",
      is_blocked: false,
    }),
  );
  api.send.mockResolvedValue(
    envelope({
      session_uuid: "new-session",
      session_title: "New analysis",
      role: "assistant",
      content: "Analysis from the API.",
    }),
  );
  api.sessions.mockResolvedValue(
    envelope({
      sessions: [session],
      pagination: { current_page: 1, last_page: 1 },
    }),
  );
  api.history.mockResolvedValue(
    envelope({
      session_uuid: session.session_uuid,
      title: session.title,
      messages: [
        { id: 13, role: "user", content: "Compare my officials." },
        {
          id: 14,
          role: "assistant",
          content:
            "### Results\n\n| Official | Score |\n| --- | --- |\n| Marcus | 7.58 |",
          widget_type: "chart",
          widget_payload: chartPayload,
        },
      ],
    }),
  );
  api.rename.mockResolvedValue(envelope({ title: "Updated title" }));
});
describe("AI director conversations", () => {
  it.each(["new chat", "saved history"])(
    "shows the Excel response cleanly in %s",
    async (mode) => {
      const user = userEvent.setup();
      if (mode === "new chat") {
        api.send.mockResolvedValueOnce(envelope(excelResponse));
        renderAssistant();
        await send(user, "Generate my ranking report");
      } else {
        api.history.mockResolvedValueOnce(
          envelope({
            session_uuid: excelResponse.session_uuid,
            title: excelResponse.session_title,
            messages: [
              { id: 61, role: "user", content: "Generate my ranking report" },
              { ...excelResponse, id: 62 },
            ],
          }),
        );
        renderAssistant([
          `/director-dashboard/ai-assistant?session=${excelResponse.session_uuid}`,
        ]);
      }
      expect(
        await screen.findByRole("link", { name: "Download spreadsheet" }),
      ).toHaveAttribute("href", excelResponse.widget_payload.download_url);
      const log = screen.getByRole("log", { name: "AI conversation" });
      expect(
        within(log).getByText("Generate my ranking report"),
      ).toBeInTheDocument();
      expect(
        within(log).getByRole("table", { name: "Spreadsheet preview" }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Conversation URL")).toHaveTextContent(
        `session=${excelResponse.session_uuid}`,
      );
      expect(
        screen.queryByText(/How can WhistleWorks AI assist/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Additional response data"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("compile_camp_rankings_excel"),
      ).not.toBeInTheDocument();
      expect(document.querySelector("pre")).toBeNull();
      expect(
        screen.getAllByRole("textbox", { name: "Message WhistleWorks AI" }),
      ).toHaveLength(1);
    },
  );
  it("keeps loading history when a conversation is renamed before its history arrives", async () => {
    let resolve;
    api.history.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    await screen.findByText("Loading conversation…");
    await user.click(
      screen.getByRole("button", { name: "Rename current conversation" }),
    );
    const title = screen.getByRole("textbox", { name: "Conversation title" });
    await user.clear(title);
    await user.type(title, "Updated title");
    await user.click(screen.getByRole("button", { name: "Save title" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("textbox", { name: "Conversation title" }),
      ).not.toBeInTheDocument(),
    );
    await act(async () =>
      resolve(
        envelope({
          session_uuid: "saved-session",
          title: "Updated title",
          messages: [
            {
              id: 51,
              role: "assistant",
              content: "History preserved after rename",
            },
          ],
        }),
      ),
    );
    expect(
      await screen.findByText("History preserved after rename"),
    ).toBeInTheDocument();
  });
  it("supports keyboard selection of a mentioned official without submitting the prompt", async () => {
    const user = userEvent.setup();
    renderAssistant();
    const input = screen.getByRole("textbox", {
      name: "Message WhistleWorks AI",
    });
    await user.type(input, "@");
    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("button", { name: "Category: Referee" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    await screen.findByRole("button", {
      name: "Select Official Marcus Johnson",
    });
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Select Official Marcus Johnson" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("@Marcus Johnson (ID: 104) ");
    expect(api.send).not.toHaveBeenCalled();
  });

  it("keeps the selected history when an earlier history request finishes late", async () => {
    let resolve;
    api.sessions.mockResolvedValue(
      envelope({
        sessions: [
          session,
          { ...session, session_uuid: "other", title: "Other session" },
        ],
        pagination: { current_page: 1, last_page: 1 },
      }),
    );
    api.history.mockImplementation((uuid) =>
      uuid === "saved-session"
        ? new Promise((done) => {
            resolve = done;
          })
        : Promise.resolve(
            envelope({
              session_uuid: "other",
              title: "Other session",
              messages: [
                { id: 31, role: "assistant", content: "Other session result" },
              ],
            }),
          ),
    );
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    await waitFor(() =>
      expect(api.history).toHaveBeenCalledWith(
        "saved-session",
        expect.any(AbortSignal),
      ),
    );
    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(
      screen.getByRole("button", { name: "Open conversation: Other session" }),
    );
    await screen.findByText("Other session result");
    await act(async () =>
      resolve(
        envelope({
          session_uuid: "saved-session",
          title: "Saved comparison",
          messages: [
            { id: 14, role: "assistant", content: "Old session result" },
          ],
        }),
      ),
    );
    expect(screen.queryByText("Old session result")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Other session" }),
    ).toBeInTheDocument();
  });
  it("shows welcome, live camp choices, quota, and a message composer", async () => {
    renderAssistant();
    expect(
      screen.getByText(/How can WhistleWorks AI assist/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Camp Scope" }),
    ).toHaveTextContent("All Camps");
    expect(
      screen.getByRole("button", { name: /ai quota details/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(api.camps).toHaveBeenCalled());
  });
  it("starts without a UUID, continues with the returned UUID, and clears it for New Chat", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await send(user, "Summarize my camps");
    await screen.findByText("Analysis from the API.");
    expect(api.send.mock.calls[0][0]).toEqual({
      message: "Summarize my camps\n\nAcross all my camps.",
      session_uuid: undefined,
    });
    await send(user, "Explain further");
    await waitFor(() => expect(api.send).toHaveBeenCalledTimes(2));
    expect(api.send.mock.calls[1][0].session_uuid).toBe("new-session");
    await user.click(screen.getByRole("button", { name: "New Chat" }));
    await send(user, "A new question");
    await waitFor(() => expect(api.send).toHaveBeenCalledTimes(3));
    expect(api.send.mock.calls[2][0].session_uuid).toBeUndefined();
  });
  it("includes selected camp and referee IDs in the submitted prompt", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await waitFor(() => expect(api.camps).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Select Camp Scope" }));
    await user.click(
      await screen.findByRole("button", { name: "Midwest Elite Summit" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
      "Compare ",
    );
    await user.click(
      screen.getByRole("button", { name: "Mention Referee or Evaluator" }),
    );
    await user.click(screen.getByRole("button", { name: "Category: Referee" }));
    await user.click(
      await screen.findByRole("button", {
        name: "Select Official Marcus Johnson",
      }),
    );
    expect(
      screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
    ).toHaveValue("Compare @Marcus Johnson (ID: 104) ");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(api.send).toHaveBeenCalled());
    expect(api.send.mock.calls[0][0].message).toContain(
      "@Marcus Johnson (ID: 104)",
    );
    expect(api.send.mock.calls[0][0].message).toContain(
      "@Midwest Elite Summit (ID: 15)",
    );
    expect(api.send.mock.calls[0][0].message).not.toContain("All Camps");
  });
  it("inserts an evaluator ID and switches camp selection back to all camps", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await user.click(screen.getByRole("button", { name: "Select Camp Scope" }));
    await user.click(
      await screen.findByRole("button", { name: "Great Lakes Ref Camp" }),
    );
    await user.click(screen.getByRole("button", { name: "Select Camp Scope" }));
    await user.click(screen.getByRole("button", { name: "All Camps" }));
    await user.click(
      screen.getByRole("button", { name: "Mention Referee or Evaluator" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Category: Evaluator" }),
    );
    await user.click(
      await screen.findByRole("button", {
        name: "Select Evaluator Staff Greg Vance",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(api.send).toHaveBeenCalled());
    expect(api.send.mock.calls[0][0].message).toContain("@Greg Vance (ID: 1)");
    expect(api.send.mock.calls[0][0].message).toContain("Across all my camps");
  });
  it("shows a clean welcome without dummy prompts or results", () => {
    renderAssistant();
    expect(screen.queryByText("Suggested AI Queries")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Compare Referees/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
    ).toHaveValue("");
    expect(api.send).not.toHaveBeenCalled();
  });
  it("loads history directly from a session URL without opening the drawer", async () => {
    renderAssistant(["/director-dashboard/ai-assistant?session=saved-session"]);
    expect(
      await screen.findByText("Compare my officials."),
    ).toBeInTheDocument();
    expect(api.history).toHaveBeenCalledWith(
      "saved-session",
      expect.any(AbortSignal),
    );
    expect(
      screen.queryByText(/How can WhistleWorks AI assist/i),
    ).not.toBeInTheDocument();
  });
  it("writes a new UUID to the URL without reloading or losing its messages, then clears it for New Chat", async () => {
    const user = userEvent.setup();
    renderAssistant(["/director-dashboard/ai-assistant?tab=insights"]);
    await send(user, "Keep my new conversation");
    await screen.findByText("Analysis from the API.");
    expect(screen.getByLabelText("Conversation URL")).toHaveTextContent(
      "?tab=insights&session=new-session",
    );
    expect(screen.getByText("Keep my new conversation")).toBeInTheDocument();
    expect(api.history).not.toHaveBeenCalled();
    expect(
      screen.queryByText(/How can WhistleWorks AI assist/i),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "New Chat" }));
    expect(screen.getByLabelText("Conversation URL")).toHaveTextContent(
      "/director-dashboard/ai-assistant?tab=insights",
    );
    expect(screen.getByLabelText("Conversation URL")).not.toHaveTextContent(
      "session=",
    );
    expect(
      screen.queryByText("Analysis from the API."),
    ).not.toBeInTheDocument();
  });
  it("restores the conversation when navigating Back and clears it again on Forward", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    await screen.findByText("Compare my officials.");
    expect(screen.getByLabelText("Conversation URL")).toHaveTextContent(
      "session=saved-session",
    );
    await user.click(screen.getByRole("button", { name: "New Chat" }));
    expect(
      screen.getByText(/How can WhistleWorks AI assist/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Browser Back" }));
    expect(
      await screen.findByText("Compare my officials."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Browser Forward" }));
    expect(
      screen.getByText(/How can WhistleWorks AI assist/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Compare my officials.")).not.toBeInTheDocument();
  });
  it("loads saved messages, Markdown tables, and the supplied chart then continues the saved session", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    expect(
      await screen.findByText("Compare my officials."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Results" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "7.58" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Performance comparison" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(api.chart).toHaveBeenCalled());
    expect(api.chart.mock.calls[0][1].data.datasets[0].data).toEqual([
      6.83, 7.67,
    ]);
    await send(user, "Explain the mechanics score");
    await waitFor(() => expect(api.send).toHaveBeenCalled());
    expect(api.send.mock.calls[0][0].session_uuid).toBe(session.session_uuid);
  });
  it("renames the current conversation with a trimmed title", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    await screen.findByText("Compare my officials.");
    await user.click(
      screen.getByRole("button", { name: "Rename current conversation" }),
    );
    const title = screen.getByRole("textbox", { name: "Conversation title" });
    expect(title).toHaveValue("Saved comparison");
    await user.clear(title);
    await user.type(title, "  Updated title  ");
    await user.click(screen.getByRole("button", { name: "Save title" }));
    await waitFor(() =>
      expect(api.rename).toHaveBeenCalledWith({
        sessionUuid: session.session_uuid,
        title: "Updated title",
      }),
    );
    expect(
      await screen.findByRole("heading", { name: "Updated title" }),
    ).toBeInTheDocument();
  });
  it("keeps rename errors visible and rejects blank titles", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await openHistory(user);
    await user.click(
      screen.getByRole("button", {
        name: "Rename conversation: Saved comparison",
      }),
    );
    const title = screen.getByRole("textbox", { name: "Conversation title" });
    await user.clear(title);
    await user.type(title, "   ");
    await user.click(screen.getByRole("button", { name: "Save title" }));
    expect(
      await screen.findByText("Enter a conversation title."),
    ).toBeInTheDocument();
    expect(api.rename).not.toHaveBeenCalled();
    api.rename.mockRejectedValueOnce(new Error("Rename unavailable"));
    await user.clear(title);
    await user.type(title, "Valid title");
    await user.click(screen.getByRole("button", { name: "Save title" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rename unavailable",
    );
    expect(
      screen.getByRole("textbox", { name: "Conversation title" }),
    ).toHaveValue("Valid title");
  });
  it("paginates saved sessions using the API pagination object", async () => {
    api.sessions.mockImplementation(({ page }) =>
      Promise.resolve(
        envelope({
          sessions:
            page === 1
              ? [session]
              : [{ session_uuid: "second", title: "Second page" }],
          pagination: { current_page: page, last_page: 2 },
        }),
      ),
    );
    const user = userEvent.setup();
    renderAssistant();
    await openHistory(user);
    await user.click(
      screen.getByRole("button", { name: "Load more conversations" }),
    );
    expect(
      await screen.findByRole("button", {
        name: "Open conversation: Second page",
      }),
    ).toBeInTheDocument();
    expect(api.sessions).toHaveBeenCalledWith(
      { page: 2 },
      expect.any(AbortSignal),
    );
  });
  it("reports send failures and retries without simulating a reply or duplicating the user message", async () => {
    api.send.mockRejectedValueOnce(new Error("Chat unavailable"));
    const user = userEvent.setup();
    renderAssistant();
    await send(user, "Show referee history");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Chat unavailable",
    );
    expect(
      screen.queryByText(/Found complete multi-year/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Copy response" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry message" }));
    expect(
      await screen.findByText("Analysis from the API."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Show referee history")).toHaveLength(1);
    expect(api.send.mock.calls[1][0]).toEqual(api.send.mock.calls[0][0]);
  });
  it("lets a failed prompt be edited and removes its failed transcript entry", async () => {
    api.send.mockRejectedValueOnce(new Error("Chat unavailable"));
    const user = userEvent.setup();
    renderAssistant();
    await send(user, "Correct this question");
    await screen.findByRole("alert");
    await user.click(screen.getByRole("button", { name: "Edit message" }));
    expect(
      screen.getByRole("textbox", { name: "Message WhistleWorks AI" }),
    ).toHaveValue("Correct this question");
    expect(
      screen.queryByRole("log", { name: "AI conversation" }),
    ).not.toBeInTheDocument();
  });
  it("does not put a late send response into another conversation", async () => {
    let resolve;
    api.send.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const user = userEvent.setup();
    renderAssistant();
    await send(user, "Pending question");
    await user.click(await openHistory(user));
    await screen.findByText("Compare my officials.");
    await act(async () =>
      resolve(envelope({ session_uuid: "late", content: "A late reply" })),
    );
    expect(screen.queryByText("A late reply")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Saved comparison" }),
    ).toBeInTheDocument();
  });
  it("shows a recoverable history loading error", async () => {
    api.history.mockRejectedValueOnce(new Error("History unavailable"));
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await openHistory(user));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "History unavailable",
    );
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Retry history" }));
    expect(
      await screen.findByText("Compare my officials."),
    ).toBeInTheDocument();
  });
  it("keeps live quota details available", async () => {
    const user = userEvent.setup();
    renderAssistant();
    await waitFor(() => expect(api.quota).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: /ai quota details/i }));
    const dialog = await screen.findByRole("dialog", {
      name: /ai quota details/i,
    });
    expect(within(dialog).getByText("1,690")).toBeInTheDocument();
  });
  it("copies full response text and exports the returned widget data", async () => {
    api.send.mockResolvedValueOnce(
      envelope({
        session_uuid: "new",
        content: "Report from API",
        widget_type: "table",
        widget_payload: {
          title: "Registrations",
          headers: ["Referee", "Status"],
          rows: [["API Official", "inactive"]],
        },
      }),
    );
    const user = userEvent.setup();
    renderAssistant();
    await send(user, "Show registrations");
    expect(await screen.findByText("API Official")).toBeInTheDocument();
    const copy = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(screen.getByRole("button", { name: "Copy response" }));
    expect(copy).toHaveBeenCalledWith("Report from API");
    await user.click(screen.getByRole("button", { name: "Export report" }));
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("renders beta version for testing purpose indicators", () => {
    renderAssistant();

    expect(
      screen.getByText("(Beta version for testing purpose)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Beta version for testing purpose"),
    ).toBeInTheDocument();
  });
});
