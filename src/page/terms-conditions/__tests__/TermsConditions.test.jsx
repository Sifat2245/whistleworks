import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TermsAndConditions from "../TermsConditions";
import * as useAxiosPublicModule from "@/hooks/useAxiosPublic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/useAxiosPublic", () => ({
  default: vi.fn(),
}));

describe("TermsAndConditions Page Component", () => {
  let queryClient;
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.mocked(useAxiosPublicModule.default).mockReturnValue({
      get: mockGet,
    });
  });

  const renderWithClient = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <TermsAndConditions />
      </QueryClientProvider>,
    );

  it("renders loading spinner while terms query is fetching", () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithClient();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders terms & conditions description when backend returns object format", async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          description: "<h2>User Terms</h2><p>By registering, you agree to these terms.</p>",
        },
      },
    });

    renderWithClient();

    expect(
      await screen.findByRole("heading", { name: "User Terms" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("By registering, you agree to these terms."),
    ).toBeInTheDocument();
  });

  it("renders terms & conditions description when backend returns array format", async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            description: "<p>Array format terms content.</p>",
          },
        ],
      },
    });

    renderWithClient();

    expect(
      await screen.findByText("Array format terms content."),
    ).toBeInTheDocument();
  });

  it("renders error state when query fails and allows retry", async () => {
    mockGet.mockRejectedValue(new Error("Network connection error"));

    renderWithClient();

    expect(
      await screen.findByText(
        "Failed to load Terms & Conditions",
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please check your connection or try again later."),
    ).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole("button", { name: "Try Again" });
    expect(tryAgainBtn).toBeInTheDocument();

    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          description: "<p>Loaded terms after retry.</p>",
        },
      },
    });

    fireEvent.click(tryAgainBtn);

    expect(
      await screen.findByText("Loaded terms after retry."),
    ).toBeInTheDocument();
  });
});
