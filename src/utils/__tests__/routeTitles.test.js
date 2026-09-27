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
    expect(getTitleForPathname("/about-us")).toBe("About Us | WhistleWorks");
    expect(getTitleForPathname("/all-camps")).toBe("Explore Camps | WhistleWorks");
    expect(getTitleForPathname("/faq")).toBe("FAQ | WhistleWorks");
    expect(getTitleForPathname("/whats-new")).toBe("What's New | WhistleWorks");
  });

  it("returns correct titles for auth routes", () => {
    expect(getTitleForPathname("/auth/signin")).toBe("Sign In | WhistleWorks");
    expect(getTitleForPathname("/auth/signup")).toBe("Sign Up | WhistleWorks");
    expect(getTitleForPathname("/auth/forget-password")).toBe("Forgot Password | WhistleWorks");
  });

  it("handles trailing slashes gracefully", () => {
    expect(getTitleForPathname("/about-us/")).toBe("About Us | WhistleWorks");
    expect(getTitleForPathname("/faq/")).toBe("FAQ | WhistleWorks");
  });

  it("resolves dynamic parameterized routes", () => {
    expect(getTitleForPathname("/all-camps/123")).toBe("Camp Details | WhistleWorks");
    expect(getTitleForPathname("/director-dashboard/camp-overview/45")).toBe("Camp Overview | WhistleWorks");
    expect(getTitleForPathname("/director-dashboard/edit-camp/99")).toBe("Edit Camp | WhistleWorks");
    expect(getTitleForPathname("/director-dashboard/ranking/10")).toBe("Camp Rankings | WhistleWorks");
  });

  it("falls back to default title for unknown routes", () => {
    expect(getTitleForPathname("/unknown-page")).toBe(DEFAULT_DOCUMENT_TITLE);
  });

  it("formats custom titles with WhistleWorks suffix", () => {
    expect(formatTitle("My Custom Page")).toBe("My Custom Page | WhistleWorks");
    expect(formatTitle("About Us | WhistleWorks")).toBe("About Us | WhistleWorks");
    expect(formatTitle("")).toBe(DEFAULT_DOCUMENT_TITLE);
    expect(formatTitle(null)).toBe(DEFAULT_DOCUMENT_TITLE);
  });
});
