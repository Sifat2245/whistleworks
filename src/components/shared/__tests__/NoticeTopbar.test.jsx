import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import NoticeTopbar from "../NoticeTopbar";

describe("NoticeTopbar Component", () => {
  it("renders notice text and megaphone icon", () => {
    render(<NoticeTopbar onViewUpdate={vi.fn()} />);

    expect(screen.getByText(/New Update:/i)).toBeInTheDocument();
    expect(screen.getByText(/Get paid directly with Stripe\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /learn more/i })).toBeInTheDocument();
  });

  it("calls onViewUpdate when 'Learn More' button is clicked", async () => {
    const handleViewUpdate = vi.fn();
    const user = userEvent.setup();

    render(<NoticeTopbar onViewUpdate={handleViewUpdate} />);

    const button = screen.getByRole("button", { name: /learn more/i });
    await user.click(button);

    expect(handleViewUpdate).toHaveBeenCalledTimes(1);
  });
});
