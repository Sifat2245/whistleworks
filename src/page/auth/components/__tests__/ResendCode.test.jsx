import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ResendCode from "../ResendCode";

describe("ResendCode Component", () => {
  it("renders countdown message when resendActive is false", () => {
    render(
      <ResendCode resendActive={false} seconds={18} handleResend={vi.fn()} />
    );

    expect(
      screen.getByText(/Didn’t receive code\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Resend in 18s/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Resend$/i)).not.toBeInTheDocument();
  });

  it("renders clickable Resend text when resendActive is true", async () => {
    const handleResend = vi.fn();
    const user = userEvent.setup();

    render(
      <ResendCode resendActive={true} seconds={0} handleResend={handleResend} />
    );

    const resendLink = screen.getByText("Resend");
    expect(resendLink).toBeInTheDocument();
    expect(resendLink).toHaveClass("cursor-pointer", "underline");

    await user.click(resendLink);
    expect(handleResend).toHaveBeenCalledTimes(1);
  });
});
