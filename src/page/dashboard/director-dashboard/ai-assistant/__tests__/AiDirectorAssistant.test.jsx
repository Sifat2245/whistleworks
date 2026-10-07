import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiDirectorAssistant from "../AiDirectorAssistant";

// Mock useGetMyCamp
vi.mock("@/hooks/api/director-hooks/useCamps", () => ({
  useGetMyCamp: () => ({
    camps: [
      { id: "camp-1", camp_name: "Midwest Elite Summit" },
      { id: "camp-2", camp_name: "Great Lakes Ref Camp" },
    ],
    isLoading: false,
  }),
}));

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("AiDirectorAssistant Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock createObjectURL & revokeObjectURL
    globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it("renders welcome hero, suggested queries, camp scope selector, and input field", () => {
    renderWithProviders(<AiDirectorAssistant />);

    expect(screen.getByLabelText(/camp scope/i)).toBeInTheDocument();
    expect(screen.getByText(/How can WhistleWorks AI assist you today/i)).toBeInTheDocument();
    expect(screen.getByText("Suggested AI Queries")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("sends user message and displays referee history response card with export and copy actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const input = screen.getByPlaceholderText(/ask about referee histories/i);
    const sendBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(input, "I need the history of Marcus Johnson");
    await user.click(sendBtn);

    expect(screen.getByText("I need the history of Marcus Johnson")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/Found complete multi-year camp history/i)).toBeInTheDocument();
        expect(screen.getByText("Positioning & Floor Spacing")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /export report/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /copy response/i })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("triggers query when clicking a suggested prompt card from empty state", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const comparePromptCard = screen.getByRole("button", {
      name: /Compare Marcus Johnson with David Rivera/i,
    });
    await user.click(comparePromptCard);

    await waitFor(
      () => {
        expect(
          screen.getByText("Head-to-Head Comparison: Marcus Johnson vs David Rivera")
        ).toBeInTheDocument();
        expect(screen.getByText(/Official A/i)).toBeInTheDocument();
        expect(screen.getByText(/Official B/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("copies response text to clipboard when clicking Copy button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const topPerformersPrompt = screen.getByRole("button", {
      name: /Who are the highest-performing referees/i,
    });
    await user.click(topPerformersPrompt);

    await waitFor(
      () => {
        expect(screen.getByText("Top-Ranked Officials Leaderboard")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const copyBtn = screen.getByRole("button", { name: /copy response/i });
    await user.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("exports response report when clicking Export Report button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const evaluatorPrompt = screen.getByRole("button", {
      name: /Give me an evaluator reliability breakdown/i,
    });
    await user.click(evaluatorPrompt);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Evaluator Reliability & Scoring Consistency Analysis/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const exportBtn = screen.getByRole("button", { name: /export report/i });
    await user.click(exportBtn);

    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
  });

  it("allows switching camp scope from the embedded model-picker inside the input toolbar", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const scopePill = screen.getByRole("button", { name: /select camp scope/i });
    expect(scopePill).toHaveTextContent(/All Camps/i);

    await user.click(scopePill);
    expect(screen.getByText("Query Camp Scope")).toBeInTheDocument();

    const midwestOption = screen.getByRole("button", {
      name: /Midwest Elite Summit/i,
    });
    await user.click(midwestOption);

    expect(screen.getByRole("button", { name: /select camp scope/i })).toHaveTextContent(
      /Midwest Elite Summit/i
    );
  });

  it("opens mention menu on @ key, allows selecting Referee category, and inserts @[Name] into input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const input = screen.getByPlaceholderText(/ask about referee histories/i);
    await user.type(input, "@");

    // Mention popup is open showing categories
    expect(screen.getByText("Mention Context (@)")).toBeInTheDocument();
    expect(screen.getByText("Referee")).toBeInTheDocument();
    expect(screen.getByText("Evaluator")).toBeInTheDocument();

    // Click Referee category
    const refCategoryBtn = screen.getByRole("button", { name: "Category: Referee" });
    await user.click(refCategoryBtn);

    expect(screen.getByText("Select Referee")).toBeInTheDocument();
    expect(screen.getByText("Marcus Johnson")).toBeInTheDocument();

    // Select Marcus Johnson
    const marcusBtn = screen.getByRole("button", { name: "Select Official Marcus Johnson" });
    await user.click(marcusBtn);

    // Input now contains @Marcus Johnson
    expect(input.value).toContain("@Marcus Johnson");
  });

  it("opens mention menu via toolbar button, allows selecting Evaluator category, and inserts @[Name]", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiDirectorAssistant />);

    const mentionToolbarBtn = screen.getByRole("button", {
      name: /mention referee or evaluator/i,
    });
    await user.click(mentionToolbarBtn);

    expect(screen.getByText("Mention Context (@)")).toBeInTheDocument();

    // Click Evaluator category
    const evalCategoryBtn = screen.getByRole("button", { name: "Category: Evaluator" });
    await user.click(evalCategoryBtn);

    expect(screen.getByText("Select Evaluator")).toBeInTheDocument();
    expect(screen.getByText("Greg Vance")).toBeInTheDocument();

    // Select Greg Vance
    const gregBtn = screen.getByRole("button", { name: "Select Evaluator Staff Greg Vance" });
    await user.click(gregBtn);

    const input = screen.getByPlaceholderText(/ask about referee histories/i);
    expect(input.value).toContain("@Greg Vance");
  });
});
