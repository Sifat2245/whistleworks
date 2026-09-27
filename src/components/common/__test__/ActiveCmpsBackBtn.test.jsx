import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ActiveCmpsBackBtn from "../ActiveCmpsBackBtn";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("ActiveCmpsBackBtn Component", () => {
  it("renders the custom label correctly", () => {
    render(<ActiveCmpsBackBtn label="Active Camps" />);
    expect(screen.getByText("Active Camps")).toBeInTheDocument();
  });

  it("navigates back (-1) when clicked", async () => {
    const user = userEvent.setup();
    render(<ActiveCmpsBackBtn label="Go Back" />);

    await user.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
