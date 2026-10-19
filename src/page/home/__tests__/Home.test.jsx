import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import * as useCmsModule from "@/hooks/api/useCms";

vi.mock("@/hooks/api/useCms", () => ({
  useHomeCms: vi.fn(),
}));

// Mock child components that rely on API calls or complex animations
vi.mock("@/page/all-camps/components/FilterCamps", () => ({
  default: () => <div data-testid="mock-filter-camps">Filter Camps Grid</div>,
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ user: null })),
}));

describe("Home Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCmsData = {
    hero: [
      {
        title: "The All-in-One Sports Officiating Platform",
        description: "Streamlining camp registrations and game assignments.",
      },
    ],
    training_camp: [
      {
        title: "Featured Officiating Camps",
        description: "Browse and register for upcoming camps.",
      },
    ],
    partners: [
      {
        title: "Trusted by Coordinators",
        description: "Used by elite basketball organizations.",
      },
    ],
    partners_logo: [
      {
        id: 1,
        image: "https://example.com/logo1.png",
        title: "Partner 1",
      },
    ],
    features: [
      {
        title: "Built for Modern Officiating",
        description: "Everything directors and referees need.",
      },
    ],
    features_item: [
      {
        id: 1,
        title: "Instant Crew Assignments",
        description: "Drag-and-drop referee scheduling.",
      },
    ],
    operations: [
      {
        title: "Ready to Transform Your Camps?",
        description: "Join the future of officiating management.",
      },
    ],
    testimonial: [
      {
        title: "What Camp Directors & Officials Say",
        description: "Hear from sports leaders using WhistleWorks.",
      },
    ],
    testimonial_card: [
      {
        id: 1,
        name: "Coach Davis",
        designation: "Camp Director",
        review: "WhistleWorks completely revolutionized how we run our camps.",
        rating: 5,
      },
    ],
  };

  it("renders loading spinner when CMS data is loading", () => {
    vi.mocked(useCmsModule.useHomeCms).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders all home page sections when CMS data is loaded", () => {
    vi.mocked(useCmsModule.useHomeCms).mockReturnValue({
      data: mockCmsData,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    // Hero section
    expect(
      screen.getByText("The All-in-One Sports Officiating Platform"),
    ).toBeInTheDocument();

    // Stats Bar
    expect(screen.getByText("Officials Evaluated")).toBeInTheDocument();

    // Featured camps section
    expect(screen.getByText("Featured Officiating Camps")).toBeInTheDocument();
    expect(screen.getByTestId("mock-filter-camps")).toBeInTheDocument();

    // Partners section
    expect(screen.getByText("Trusted by Coordinators")).toBeInTheDocument();

    // Features section
    expect(screen.getByText("Built for Modern Officiating")).toBeInTheDocument();
    expect(screen.getByText("Instant Crew Assignments")).toBeInTheDocument();

    // Interactive Demo Assignment section
    expect(
      screen.getByText("Interactive Court Assignment Experience"),
    ).toBeInTheDocument();

    // CTA Section
    expect(
      screen.getByText("Ready to Transform Your Camps?"),
    ).toBeInTheDocument();

    // Testimonials
    expect(
      screen.getByText("What Camp Directors & Officials Say"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Coach Davis").length).toBeGreaterThanOrEqual(1);
  });
});
