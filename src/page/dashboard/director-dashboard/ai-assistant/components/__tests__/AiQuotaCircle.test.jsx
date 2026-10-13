import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiQuotaCircle from "../AiQuotaCircle";

const mockRefetch = vi.fn();
let mockQuotaData = {
  plan_tier: "free",
  monthly_query_limit: 50,
  queries_used_this_month: 1,
  remaining_queries: 49,
  tokens_used_this_month: 1690,
  quota_resets_at: "2026-11-10T00:00:00+00:00",
  is_blocked: false,
};

vi.mock("@/hooks/api/director-hooks/useAiChat", () => ({
  useGetAiQuota: () => ({
    quota: mockQuotaData,
    isLoading: false,
    isError: false,
    refetch: mockRefetch,
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

describe("AiQuotaCircle Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuotaData = {
      plan_tier: "free",
      monthly_query_limit: 50,
      queries_used_this_month: 1,
      remaining_queries: 49,
      tokens_used_this_month: 1690,
      quota_resets_at: "2026-11-10T00:00:00+00:00",
      is_blocked: false,
    };
  });

  it("renders circular progress trigger button without displaying number", () => {
    renderWithProviders(<AiQuotaCircle />);

    const triggerBtn = screen.getByRole("button", { name: /ai quota details/i });
    expect(triggerBtn).toBeInTheDocument();
    expect(triggerBtn).toHaveAttribute(
      "title",
      expect.stringContaining("49 of 50 queries remaining")
    );
  });

  it("opens popover dialog on click and displays quota breakdown", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiQuotaCircle />);

    const triggerBtn = screen.getByRole("button", { name: /ai quota details/i });
    await user.click(triggerBtn);

    const dialog = screen.getByRole("dialog", { name: /ai quota details/i });
    expect(dialog).toBeInTheDocument();

    expect(screen.getByText("AI Prompt Quota")).toBeInTheDocument();
    expect(screen.getByText("free Tier")).toBeInTheDocument();
    expect(screen.getByText(/\/ 50 prompts/i)).toBeInTheDocument();
    expect(screen.getByText("1,690")).toBeInTheDocument();
    expect(screen.getByText(/Nov 10, 2026/i)).toBeInTheDocument();
  });

  it("closes popover when pressing Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiQuotaCircle />);

    const triggerBtn = screen.getByRole("button", { name: /ai quota details/i });
    await user.click(triggerBtn);

    expect(screen.getByRole("dialog", { name: /ai quota details/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("dialog", { name: /ai quota details/i })
    ).not.toBeInTheDocument();
  });

  it("displays blocked alert banner when is_blocked is true", async () => {
    const user = userEvent.setup();
    const blockedQuota = {
      ...mockQuotaData,
      is_blocked: true,
      remaining_queries: 0,
      queries_used_this_month: 50,
    };

    renderWithProviders(<AiQuotaCircle quota={blockedQuota} />);

    const triggerBtn = screen.getByRole("button", { name: /ai quota details/i });
    await user.click(triggerBtn);

    expect(screen.getByText(/monthly quota limit reached/i)).toBeInTheDocument();
  });

  it("triggers refetch when clicking the refresh button in footer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiQuotaCircle />);

    const triggerBtn = screen.getByRole("button", { name: /ai quota details/i });
    await user.click(triggerBtn);

    const refreshBtn = screen.getByRole("button", { name: /refresh quota/i });
    await user.click(refreshBtn);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
