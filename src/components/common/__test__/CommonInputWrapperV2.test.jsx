import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LuMail } from "react-icons/lu";
import CommonInputWrapperV2 from "../CommonInputWrapperV2";

describe("CommonInputWrapperV2 Component", () => {
  const mockRegister = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  it("renders with label, placeholder, and left icon", () => {
    render(
      <CommonInputWrapperV2
        label="Camp Director Name"
        register_as="director_name"
        placeholder="Enter director name"
        icon={<LuMail data-testid="mail-icon" />}
        register={mockRegister}
      />
    );

    expect(screen.getByLabelText(/camp director name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter director name/i)).toBeInTheDocument();
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });

  it("toggles password visibility with aria-label", async () => {
    const user = userEvent.setup();

    render(
      <CommonInputWrapperV2
        label="Password"
        type="password"
        register_as="password"
        placeholder="Enter password"
        register={mockRegister}
      />
    );

    const input = screen.getByPlaceholderText(/enter password/i);
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /show password/i });
    await user.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();
  });

  it("renders textarea when type=textarea", () => {
    render(
      <CommonInputWrapperV2
        label="Notes"
        type="textarea"
        register_as="notes"
        placeholder="Add special notes"
        register={mockRegister}
      />
    );

    const textarea = screen.getByPlaceholderText(/add special notes/i);
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("displays validation error message", () => {
    const errors = {
      notes: { message: "Notes must be under 500 characters" },
    };

    render(
      <CommonInputWrapperV2
        label="Notes"
        register_as="notes"
        register={mockRegister}
        errors={errors}
      />
    );

    expect(screen.getByText("Notes must be under 500 characters")).toBeInTheDocument();
  });
});
