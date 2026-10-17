import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ContactUs from "../ContactUs";
import * as contactHookModule from "@/hooks/api/useContact";
import toast from "react-hot-toast";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/api/useContact", () => ({
  useSubmitContactForm: vi.fn(),
}));

describe("ContactUs Page Component", () => {
  let mockMutate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate = vi.fn();
    vi.mocked(contactHookModule.useSubmitContactForm).mockImplementation((options) => ({
      mutate: (data) => {
        mockMutate(data);
        if (options?.onSuccess) {
          options.onSuccess({ data: { message: "Success message" } });
        }
      },
      isPending: false,
    }));
  });

  it("renders page header, contact information card, and form inputs without phone", () => {
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /we'd love to hear from you/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Support & Communications")).toBeInTheDocument();
    expect(screen.getByText("drewbontrager@gmail.com")).toBeInTheDocument();

    expect(screen.queryByText("+1 (800) WHISTLE")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/e\.g\. 01526302623/i)).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText(/e\.g\. john doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. john@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. camp registration inquiry/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell us about your inquiry/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /submit message/i })
    ).toBeInTheDocument();
  });

  it("displays validation error messages when submitting empty form", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /submit message/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
      expect(screen.getByText("Email address is required")).toBeInTheDocument();
      expect(screen.getByText("Subject is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("successfully submits form with valid data and renders success alert", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/e\.g\. john doe/i), "Ariful");
    await user.type(
      screen.getByPlaceholderText(/e\.g\. john@example\.com/i),
      "rufuzxyz@gmail.com"
    );
    await user.type(
      screen.getByPlaceholderText(/e\.g\. camp registration inquiry/i),
      "Camp Inquiry"
    );
    await user.type(
      screen.getByPlaceholderText(/tell us about your inquiry/i),
      "Hello, this is a valid message of sufficient length."
    );

    const submitBtn = screen.getByRole("button", { name: /submit message/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Ariful",
        email: "rufuzxyz@gmail.com",
        subject: "Camp Inquiry",
        message: "Hello, this is a valid message of sufficient length.",
      });
      expect(toast.success).toHaveBeenCalledWith("Success message");
      expect(screen.getByText("Message Sent Successfully!")).toBeInTheDocument();
    });
  });

  it("shows loader inside submit button when mutation is pending", () => {
    vi.mocked(contactHookModule.useSubmitContactForm).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button");
    expect(submitBtn).toBeDisabled();
    expect(screen.queryByText("Submit Message")).not.toBeInTheDocument();
  });
});
