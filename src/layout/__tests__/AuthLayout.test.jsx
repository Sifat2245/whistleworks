import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../AuthLayout";

vi.mock("@/components/common/DynamicTitleManager", () => ({
  default: () => <div data-testid="mock-dynamic-title">Dynamic Title Manager</div>,
}));

describe("AuthLayout Component", () => {
  it("renders back to home link, logo, copyright, and outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/auth/signin"]}>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route
              path="signin"
              element={<div data-testid="signin-page">Sign In Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-dynamic-title")).toBeInTheDocument();
    expect(screen.getByText("Back to home")).toBeInTheDocument();
    expect(screen.getByAltText("Whistle Works Logo")).toBeInTheDocument();
    expect(screen.getByTestId("signin-page")).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} Whistle Works. All rights reserved.`))
    ).toBeInTheDocument();
  });
});
