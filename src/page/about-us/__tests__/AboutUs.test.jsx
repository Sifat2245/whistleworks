import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AboutUs from "../AboutUs";
import * as useCmsModule from "@/hooks/api/useCms";

vi.mock("@/hooks/api/useCms", () => ({
  useAboutCms: vi.fn(),
}));

describe("AboutUs Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAboutData = {
    hero: [
      {
        title: "Elevating Sports Officiating",
        description: "Developing better officials through elite training.",
      },
    ],
    owner_info: {
      name: "Drew Bontrager",
      designation: "Founder & Camp Director",
      bio: "Former NCAA official and camp director.",
      image: "https://example.com/drew.jpg",
      quote: "Officiating is about precision and integrity.",
      stats: [
        { value: "15+", label: "Years Experience" },
        { value: "500+", label: "Referees Trained" },
        { value: "25+", label: "Camps Hosted" },
      ],
    },
    mission: [
      {
        title: "Our Mission",
        description: "To standardize referee evaluation nationwide.",
        vision_title: "Our Vision",
        vision_description: "A modern technological bridge for sports officials.",
      },
    ],
    key_to_excellence: {
      title: "The Keys to Excellence",
      subtitle: "Built by officials, for officials.",
    },
    bottom_description: {
      title: "Our Commitment",
      description: "Paragraph one.\n\nParagraph two.",
    },
    features_item: [
      {
        title: "Video Breakdown",
        description: "Instant play replay analysis.",
      },
      {
        title: "Live Grading",
        description: "Rubric-based real-time feedback.",
      },
    ],
    team_header: {
      badge: "Our Staff",
      title: "Elite Leadership",
      subtitle: "Veteran coordinators guiding the next generation.",
    },
    team_member: [
      {
        id: 1,
        title: "Jane Smith",
        designation: "Head Evaluator",
        bio: "20 years of Division 1 experience.",
        image: "https://example.com/jane.jpg",
      },
    ],
    get_started: {
      title: "Ready to Level Up?",
      description: "Register for an upcoming camp today.",
      primary_cta_text: "Browse Camps",
      secondary_cta_text: "Contact Us",
    },
  };

  it("renders loading state when data is loading", () => {
    vi.mocked(useCmsModule.useAboutCms).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Loading About WhistleWorks..."),
    ).toBeInTheDocument();
  });

  it("renders loading state when aboutData is missing", () => {
    vi.mocked(useCmsModule.useAboutCms).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Loading About WhistleWorks..."),
    ).toBeInTheDocument();
  });

  it("renders full about page content when data is provided", () => {
    vi.mocked(useCmsModule.useAboutCms).mockReturnValue({
      data: mockAboutData,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    // Hero
    expect(
      screen.getByRole("heading", { name: "Elevating Sports Officiating" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Developing better officials through elite training."),
    ).toBeInTheDocument();

    // Stats
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("25+")).toBeInTheDocument();

    // Owner info
    expect(screen.getByText("Drew Bontrager")).toBeInTheDocument();
    expect(screen.getByText("Founder & Camp Director")).toBeInTheDocument();

    // Features
    expect(screen.getByText("Video Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Live Grading")).toBeInTheDocument();

    // Team
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Head Evaluator")).toBeInTheDocument();

    // CTA
    expect(screen.getByText("Ready to Level Up?")).toBeInTheDocument();
    expect(screen.getByText("Get Started Now")).toBeInTheDocument();
  });

  it("renders defaults gracefully when some fields are empty", () => {
    vi.mocked(useCmsModule.useAboutCms).mockReturnValue({
      data: {
        hero: [],
        owner_info: {},
        mission: [],
        team_member: [],
      },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    // Default hero heading
    expect(
      screen.getByRole("heading", { name: "Elevating Sports Officiating" }),
    ).toBeInTheDocument();
  });
});
