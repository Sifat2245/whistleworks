import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import CampHeroSection from "../CampHeroSection";
import CampStatsGrid from "../CampStatsGrid";
import CampAboutSection from "../CampAboutSection";
import CampDirectorSection from "../CampDirectorSection";
import CampStickySidebar from "../CampStickySidebar";
import CampMobileStickyBar from "../CampMobileStickyBar";
import CampBottomCta from "../CampBottomCta";
import CampDetailsSkeleton from "../CampDetailsSkeleton";
import CampDetailsError from "../CampDetailsError";

describe("Camp Details Presentation Components", () => {
  describe("CampHeroSection", () => {
    it("renders hero info, status badge, dates, and handles register click", async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();

      render(
        <MemoryRouter>
          <CampHeroSection
            campName="Midwest Showcase"
            campLogo="https://example.com/logo.png"
            sportsTypeName="Basketball"
            location="Chicago, IL"
            startDate="2026-07-01"
            endDate="2026-07-03"
            statusMeta={{ label: "Upcoming", badge: "bg-emerald-50 text-emerald-700" }}
            durationDays={3}
            onRegisterClick={onRegister}
          />
        </MemoryRouter>,
      );

      expect(screen.getByRole("heading", { name: "Midwest Showcase" })).toBeInTheDocument();
      expect(screen.getByText("Upcoming")).toBeInTheDocument();
      expect(screen.getByText("Chicago, IL")).toBeInTheDocument();
      expect(screen.getByText("3 days")).toBeInTheDocument();

      const registerBtn = screen.getByRole("button", { name: /register now/i });
      await user.click(registerBtn);
      expect(onRegister).toHaveBeenCalledTimes(1);
    });

    it("falls back to default texts when optional props are omitted", () => {
      render(
        <MemoryRouter>
          <CampHeroSection
            statusMeta={{ label: "Upcoming", badge: "bg-emerald-50 text-emerald-700" }}
          />
        </MemoryRouter>,
      );

      expect(screen.getByRole("heading", { name: "Untitled Camp" })).toBeInTheDocument();
      expect(screen.getByText("Location not specified")).toBeInTheDocument();
      expect(screen.getByText("Sports Camp")).toBeInTheDocument();
    });
  });

  describe("CampStatsGrid", () => {
    it("renders quick statistics grid correctly", () => {
      render(
        <CampStatsGrid
          startDate="2026-07-01"
          endDate="2026-07-03"
          sportsTypeName="Basketball"
          location="Dallas, TX"
          price="$150"
        />,
      );

      expect(screen.getByText("Basketball")).toBeInTheDocument();
      expect(screen.getByText("Dallas, TX")).toBeInTheDocument();
      expect(screen.getByText("$150")).toBeInTheDocument();
      expect(screen.getByText("Camp Fee")).toBeInTheDocument();
    });
  });

  describe("CampAboutSection", () => {
    it("renders HTML content when campDetails is provided", () => {
      render(<CampAboutSection campDetails="<p>Elite training with veteran refs.</p>" />);

      expect(screen.getByText("About the Camp")).toBeInTheDocument();
      expect(screen.getByText("Elite training with veteran refs.")).toBeInTheDocument();
    });

    it("renders fallback message when details are missing", () => {
      render(<CampAboutSection campDetails="" />);

      expect(screen.getByText("No description available.")).toBeInTheDocument();
    });
  });

  describe("CampDirectorSection", () => {
    it("renders director info with email, phone, and address", () => {
      render(
        <CampDirectorSection
          directorName="Sarah Jenkins"
          directorAvatar="https://example.com/avatar.png"
          directorEmail="sarah@example.com"
          directorPhone="+1 555-4321"
          directorAddress="456 Whistle Blvd"
        />,
      );

      expect(screen.getByText("Meet Your Camp Director")).toBeInTheDocument();
      expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument();
      expect(screen.getByText("sarah@example.com")).toBeInTheDocument();
      expect(screen.getByText("+1 555-4321")).toBeInTheDocument();
      expect(screen.getByText("456 Whistle Blvd")).toBeInTheDocument();
    });

    it("renders default fallback name when omitted", () => {
      render(<CampDirectorSection />);

      expect(screen.getAllByText("Camp Director").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("CampStickySidebar", () => {
    it("renders price, countdown, and triggers registration callback", async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();

      render(
        <CampStickySidebar
          price="$200"
          statusMeta={{ label: "Open", badge: "bg-sky-50 text-sky-700" }}
          countdown={{ days: 5, hours: 12, minutes: 30, seconds: 45, isExpired: false }}
          startDate="2026-08-01"
          endDate="2026-08-03"
          sportsTypeName="Basketball"
          location="Denver, CO"
          durationDays={3}
          onRegisterClick={onRegister}
        />,
      );

      expect(screen.getByText("$200")).toBeInTheDocument();
      expect(screen.getByText("Camp starts in")).toBeInTheDocument();
      expect(screen.getByText("Denver, CO")).toBeInTheDocument();

      const registerBtn = screen.getByRole("button", { name: /register now/i });
      await user.click(registerBtn);
      expect(onRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe("CampMobileStickyBar", () => {
    it("renders when showMobileBar is true and handles register click", async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();

      render(
        <CampMobileStickyBar
          showMobileBar={true}
          price="$100"
          statusMeta={{ label: "Open", badge: "bg-sky-50 text-sky-700" }}
          onRegisterClick={onRegister}
        />,
      );

      expect(screen.getByText("$100")).toBeInTheDocument();
      const registerBtn = screen.getByRole("button", { name: /register now/i });
      await user.click(registerBtn);
      expect(onRegister).toHaveBeenCalledTimes(1);
    });

    it("sets inert and hidden when showMobileBar is false", () => {
      const { container } = render(
        <CampMobileStickyBar
          showMobileBar={false}
          price="$100"
          statusMeta={{ label: "Open", badge: "bg-sky-50 text-sky-700" }}
          onRegisterClick={vi.fn()}
        />,
      );

      const bar = container.firstChild;
      expect(bar).toHaveClass("translate-y-full");
    });
  });

  describe("CampBottomCta", () => {
    it("renders camp bottom CTA banner and fires onRegisterClick", async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();

      render(
        <CampBottomCta
          campName="All-Star Referee Clinic"
          directorName="Coach Bob"
          sportsTypeName="Basketball"
          onRegisterClick={onRegister}
        />,
      );

      expect(
        screen.getByRole("heading", {
          name: "Ready to take your officiating to the next level?",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Join All-Star Referee Clinic and train with Coach Bob/i),
      ).toBeInTheDocument();

      const registerBtn = screen.getByRole("button", { name: /register now/i });
      await user.click(registerBtn);
      expect(onRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe("CampDetailsSkeleton & CampDetailsError", () => {
    it("renders CampDetailsSkeleton without errors", () => {
      const { container } = render(<CampDetailsSkeleton />);
      expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    });

    it("renders CampDetailsError and triggers retry button", () => {
      const onRetry = vi.fn();
      render(
        <MemoryRouter>
          <CampDetailsError onRetry={onRetry} />
        </MemoryRouter>,
      );

      expect(screen.getByText("We couldn't load this camp")).toBeInTheDocument();
      const retryBtn = screen.getByRole("button", { name: /try again/i });
      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });
});
