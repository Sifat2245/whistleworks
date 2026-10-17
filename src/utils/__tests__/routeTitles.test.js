import { describe, it, expect } from "vitest";
import {
  getTitleForPathname,
  formatTitle,
  ROUTE_TITLES,
  DEFAULT_DOCUMENT_TITLE,
} from "../routeTitles";

describe("routeTitles utility", () => {
  it("returns correct titles for static public routes", () => {
    expect(getTitleForPathname("/")).toBe(ROUTE_TITLES["/"]);
    expect(getTitleForPathname("/about-us")).toBe("About Us");
    expect(getTitleForPathname("/contact-us")).toBe("Contact Us");
    expect(getTitleForPathname("/contact")).toBe("Contact Us");
    expect(getTitleForPathname("/all-camps")).toBe("Explore Camps");
    expect(getTitleForPathname("/faq")).toBe("FAQ");
    expect(getTitleForPathname("/whats-new")).toBe("What's New");
  });

  it("returns correct titles for auth routes", () => {
    expect(getTitleForPathname("/auth/signin")).toBe("Sign In");
    expect(getTitleForPathname("/auth/signup")).toBe("Sign Up");
    expect(getTitleForPathname("/auth/forget-password")).toBe("Forgot Password");
  });

  it("handles trailing slashes gracefully", () => {
    expect(getTitleForPathname("/about-us/")).toBe("About Us");
    expect(getTitleForPathname("/faq/")).toBe("FAQ");
  });

  it("resolves dynamic parameterized routes", () => {
    expect(getTitleForPathname("/all-camps/123")).toBe("Camp Details");
    expect(getTitleForPathname("/director-dashboard/camp-overview/45")).toBe("Camp Overview");
    expect(getTitleForPathname("/director-dashboard/edit-camp/99")).toBe("Edit Camp");
    expect(getTitleForPathname("/director-dashboard/ranking/10")).toBe("Camp Rankings");
  });

  it("falls back to default title for unknown routes", () => {
    expect(getTitleForPathname("/unknown-page")).toBe(DEFAULT_DOCUMENT_TITLE);
  });

  it("formats custom titles", () => {
    expect(formatTitle("My Custom Page")).toBe("My Custom Page");
    expect(formatTitle("About Us")).toBe("About Us");
    expect(formatTitle("")).toBe(DEFAULT_DOCUMENT_TITLE);
    expect(formatTitle(null)).toBe(DEFAULT_DOCUMENT_TITLE);
  });
});
