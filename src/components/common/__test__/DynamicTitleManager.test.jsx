import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DynamicTitleManager from "../DynamicTitleManager";

describe("DynamicTitleManager Component", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("updates document.title for public routes", () => {
    render(
      <MemoryRouter initialEntries={["/about-us"]}>
        <DynamicTitleManager />
      </MemoryRouter>
    );

    expect(document.title).toBe("About Us | WhistleWorks");
  });

  it("updates document.title for all-camps route", () => {
    render(
      <MemoryRouter initialEntries={["/all-camps"]}>
        <DynamicTitleManager />
      </MemoryRouter>
    );

    expect(document.title).toBe("Explore Camps | WhistleWorks");
  });

  it("updates document.title for director dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <DynamicTitleManager />
      </MemoryRouter>
    );

    expect(document.title).toBe("Director Dashboard | WhistleWorks");
  });
});
