import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NoticePopup from "../NoticePopup";
import * as stripeHookModule from "@/hooks/api/director-hooks/useStripConnection";

vi.mock("@/hooks/api/director-hooks/useStripConnection", () => ({
  useConnectStripe: vi.fn(),
}));

describe("NoticePopup Component", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(stripeHookModule.useConnectStripe).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("does not render dialog when isOpen is false", () => {
    render(<NoticePopup isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders popup dialog with benefits and steps when isOpen is true", () => {
    render(<NoticePopup isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /new update: get paid directly/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/direct payouts to your bank/i)).toBeInTheDocument();
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connect stripe/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remind me later/i })
    ).toBeInTheDocument();
  });

  it("calls onClose when 'Remind Me Later' is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(<NoticePopup isOpen={true} onClose={handleClose} />);

    const remindBtn = screen.getByRole("button", { name: /remind me later/i });
    await user.click(remindBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close icon button is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(<NoticePopup isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls connectStripe mutation when 'Connect Stripe' is clicked", async () => {
    const user = userEvent.setup();

    render(<NoticePopup isOpen={true} onClose={vi.fn()} />);

    const connectBtn = screen.getByRole("button", { name: /connect stripe/i });
    await user.click(connectBtn);

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it("disables connect button and shows loading spinner when isPending=true", () => {
    vi.mocked(stripeHookModule.useConnectStripe).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<NoticePopup isOpen={true} onClose={vi.fn()} />);

    const connectBtn = screen.getByRole("button", { name: /connecting\.\.\./i });
    expect(connectBtn).toBeDisabled();
  });
});
