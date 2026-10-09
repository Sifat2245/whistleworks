import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OtpWrapper from "../OtpWrapper";

describe("OtpWrapper Component", () => {
  it("renders 4 OTP input boxes", () => {
    render(<OtpWrapper otp="" OtpChange={vi.fn()} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
  });

  it("calls OtpChange when user enters all 4 digits", () => {
    const handleOtpChange = vi.fn();

    render(<OtpWrapper otp="" OtpChange={handleOtpChange} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.input(inputs[0], { target: { value: "1234" } });

    expect(handleOtpChange).toHaveBeenCalledWith("1234");
  });
});
