import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Hero from "../Hero";
import StatsBar from "../StatsBar";
import TrainingCamps from "../TrainingCamps";
import Partners from "../Partners";
import Features from "../Features";
import ReadyToTrasform from "../ReadyToTrasform";
import Reviews from "../Reviews";
import DemoAssignment from "../demoAssignment";

vi.mock("@/page/all-camps/components/FilterCamps", () => ({
  default: ({ limit }) => (
    <div data-testid="mock-filter-camps">Filter Camps Limit: {limit}</div>
  ),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ userData: null })),
}));

describe("Home Page Presentation Components", () => {
  describe("Hero Component", () => {
    it("renders title, description, and auth login action button", () => {
      render(
        <MemoryRouter>
          <Hero
            heroData={{
              title: "Elevate Your Game",
              description: "The complete platform for referee camps.",
            }}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole("heading", { name: "Elevate Your Game" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The complete platform for referee camps."),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
        "href",
        "/auth/signin",
      );
    });

    it("falls back to default texts when heroData is empty", () => {
      render(
        <MemoryRouter>
          <Hero />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("Referee Camp Management Made Simple"),
      ).toBeInTheDocument();
    });
  });

  describe("StatsBar Component", () => {
    it("renders the 4 key platform metrics", () => {
      render(<StatsBar />);

      expect(screen.getByText("30+")).toBeInTheDocument();
      expect(screen.getByText("Camps Managed")).toBeInTheDocument();
      expect(screen.getByText("1,000+")).toBeInTheDocument();
      expect(screen.getByText("Officials Evaluated")).toBeInTheDocument();
      expect(screen.getByText("99.9%")).toBeInTheDocument();
      expect(screen.getByText("4.9 / 5")).toBeInTheDocument();
    });
  });

  describe("TrainingCamps Component", () => {
    it("renders featured camps title and link to all camps", () => {
      render(
        <MemoryRouter>
          <TrainingCamps
            trainingCampData={{
              title: "Upcoming Training Camps",
              description: "Select a camp below to register.",
            }}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole("heading", { name: "Upcoming Training Camps" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Select a camp below to register."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("mock-filter-camps")).toHaveTextContent(
        "Filter Camps Limit: 4",
      );
      expect(
        screen.getByRole("link", { name: /explore all camps/i }),
      ).toHaveAttribute("href", "/all-camps");
    });
  });

  describe("Partners Component", () => {
    it("renders partner logos and heading", () => {
      render(
        <MemoryRouter>
          <Partners
            partners={{
              title: "Our Trusted Partners",
            }}
            partnerLogos={[
              { id: 1, image: "https://example.com/logo1.png", title: "NCAA East" },
            ]}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText("Our Trusted Partners")).toBeInTheDocument();
      expect(screen.getAllByAltText("Partner logo").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Features Component", () => {
    it("renders features list with titles and descriptions", () => {
      render(
        <Features
          mainFeature={{
            title: "Platform Capabilities",
            description: "Built from the ground up for officials.",
          }}
          featureItems={[
            {
              id: 1,
              title: "Digital Evaluations",
              description: "Instant feedback rubrics.",
            },
          ]}
        />,
      );

      expect(screen.getByText("Platform Capabilities")).toBeInTheDocument();
      expect(screen.getByText("Digital Evaluations")).toBeInTheDocument();
      expect(screen.getByText("Instant feedback rubrics.")).toBeInTheDocument();
    });
  });

  describe("ReadyToTrasform Component", () => {
    it("renders transformation CTA with link to sign up", () => {
      render(
        <MemoryRouter>
          <ReadyToTrasform
            operationData={{
              title: "Ready to Transform Your Officiating?",
              description: "Get started with your free coordinator account.",
            }}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByText("Ready to Transform Your Officiating?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Get started with your free coordinator account."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /create your account/i }),
      ).toHaveAttribute("href", "/auth/signup");
    });
  });

  describe("Reviews Component", () => {
    it("renders testimonials and rating stars", () => {
      render(
        <Reviews
          testimonialTitle={{
            title: "What Officials Say",
            description: "Feedback from past camp attendees.",
          }}
          testimonials={[
            {
              id: 1,
              name: "John Ref",
              designation: "College Official",
              review: "Best camp management software on the market.",
              rating: 5,
            },
          ]}
        />,
      );

      expect(screen.getByText("What Officials Say")).toBeInTheDocument();
      expect(screen.getAllByText("John Ref").length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getAllByText("College Official").length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe("DemoAssignment Component", () => {
    it("renders interactive assignment experience with courts and buttons", async () => {
      const user = userEvent.setup();

      render(<DemoAssignment />);

      expect(
        screen.getByText("Interactive Court Assignment Experience"),
      ).toBeInTheDocument();
      expect(screen.getByText("Individual Refs")).toBeInTheDocument();
      expect(screen.getByText("Crews Mode")).toBeInTheDocument();

      // Toggle from Individual to Crews Mode
      const crewsBtn = screen.getByText("Crews Mode").closest("button");
      await user.click(crewsBtn);

      // Reset Demo button
      const resetBtn = screen.getByRole("button", { name: /reset demo/i });
      await user.click(resetBtn);

      expect(screen.getByText("Individual Refs")).toBeInTheDocument();
    });
  });
});
