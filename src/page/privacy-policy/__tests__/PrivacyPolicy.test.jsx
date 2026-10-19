import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PrivacyPolicy from "../PrivacyPolicy";
import * as useAxiosPublicModule from "@/hooks/useAxiosPublic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/useAxiosPublic", () => ({
  default: vi.fn(),
}));

describe("PrivacyPolicy Page Component", () => {
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
        <PrivacyPolicy />
      </QueryClientProvider>,
    );

  it("renders loading spinner while policy query is fetching", () => {
    mockGet.mockReturnValue(new Promise(() => {})); // Never resolves

    const { container } = renderWithClient();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders privacy policy description when backend returns object format", async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          description: "<h2>Privacy Overview</h2><p>Your privacy is important to us.</p>",
        },
      },
    });

    renderWithClient();

    expect(
      await screen.findByRole("heading", { name: "Privacy Overview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your privacy is important to us."),
    ).toBeInTheDocument();
  });

  it("renders privacy policy description when backend returns array format", async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            description: "<p>Array format policy terms.</p>",
          },
        ],
      },
    });

    renderWithClient();

    expect(
      await screen.findByText("Array format policy terms."),
    ).toBeInTheDocument();
  });

  it("strips script tags and forbidden HTML elements", async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          description:
            "<p>Safe content</p><script>alert('xss')</script><iframe src='https://malicious.com'></iframe>",
        },
      },
    });

    renderWithClient();

    expect(await screen.findByText("Safe content")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("renders error state when query fails and allows retry", async () => {
    mockGet.mockRejectedValue(new Error("Network connection error"));

    renderWithClient();

    expect(
      await screen.findByText("Couldnt load Privacy Policy", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Network connection error")).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole("button", { name: "Try Again" });
    expect(tryAgainBtn).toBeInTheDocument();

    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          description: "<p>Loaded after retry.</p>",
        },
      },
    });

    fireEvent.click(tryAgainBtn);

    expect(await screen.findByText("Loaded after retry.")).toBeInTheDocument();
  });
});
