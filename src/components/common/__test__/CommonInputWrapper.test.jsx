import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CommonInputWrapper from "../CommonInputWrapper";

describe("CommonInputWrapper Component", () => {
  const mockRegister = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  it("renders text input with label and placeholder", () => {
    render(
      <CommonInputWrapper
        label="Email Address"
        register_as="email"
        placeholder="Enter your email"
        register={mockRegister}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(mockRegister).toHaveBeenCalledWith("email", {});
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CommonInputWrapper
        label="Password"
        type="password"
        register_as="password"
        placeholder="Enter password"
        register={mockRegister}
      />
    );

    const input = screen.getByPlaceholderText(/enter password/i);
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button");
    await user.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");

    await user.click(toggleBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders textarea when type=textarea", () => {
    render(
      <CommonInputWrapper
        label="Camp Description"
        type="textarea"
        register_as="description"
        placeholder="Tell us about the camp"
        register={mockRegister}
      />
    );

    const textarea = screen.getByPlaceholderText(/tell us about the camp/i);
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("displays error message when provided in errors object", () => {
    const errors = {
      email: { message: "Invalid email format" },
    };

    render(
      <CommonInputWrapper
        label="Email"
        register_as="email"
        register={mockRegister}
        errors={errors}
      />
    );

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });
});
