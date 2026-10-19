import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../NotFound";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NotFound Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderNotFound = () =>
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

  it("renders 404 heading, out of bounds message, and quick links", () => {
    renderNotFound();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Out of Bounds")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Whoops! This Play Was Called Back.",
      }),
    ).toBeInTheDocument();

    // Quick links
    expect(screen.getByText("Find Camps")).toBeInTheDocument();
    expect(screen.getByText("Director Dashboard")).toBeInTheDocument();
    expect(screen.getByText("What's New")).toBeInTheDocument();
    expect(screen.getByText("Help & FAQ")).toBeInTheDocument();
  });

  it("triggers whistle blow animation when whistle badge is clicked", () => {
    renderNotFound();

    const whistleBadge = screen.getByTitle("Click to blow whistle!");
    expect(whistleBadge).toBeInTheDocument();

    fireEvent.click(whistleBadge);

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(whistleBadge).toBeInTheDocument();
  });

  it("navigates back when Go Back button is clicked", () => {
    renderNotFound();

    const goBackBtn = screen.getByRole("button", { name: /go back/i });
    fireEvent.click(goBackBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("links to home from Return to Home button", () => {
    renderNotFound();

    const homeLink = screen.getByRole("link", { name: /return to home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
