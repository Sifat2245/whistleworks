import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import BackBtn from "../BackBtn";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("BackBtn Component", () => {
  it("renders the button and text", () => {
    render(<BackBtn />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
  });

  it("navigates to /director-dashboard when clicked", async () => {
    const user = userEvent.setup();
    render(<BackBtn />);

    await user.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/director-dashboard");
  });
});
