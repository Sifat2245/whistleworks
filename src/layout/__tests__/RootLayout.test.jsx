import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../RootLayout";

vi.mock("@/components/shared/Header", () => ({
  default: () => <header data-testid="mock-header">Mock Header</header>,
}));

vi.mock("@/components/shared/Footer", () => ({
  default: () => <footer data-testid="mock-footer">Mock Footer</footer>,
}));

vi.mock("@/components/common/DynamicTitleManager", () => ({
  default: () => <div data-testid="mock-dynamic-title">Dynamic Title Manager</div>,
}));

describe("RootLayout Component", () => {
  it("renders header, footer, dynamic title manager, and child outlet content", () => {
    const testRouter = createMemoryRouter(
      [
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <div data-testid="test-home-page">Home Page Body</div>,
            },
          ],
        },
      ],
      { initialEntries: ["/"] }
    );

    render(<RouterProvider router={testRouter} />);

    expect(screen.getByTestId("mock-dynamic-title")).toBeInTheDocument();
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("test-home-page")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
