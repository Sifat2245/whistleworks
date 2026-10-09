import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ForgetPassword from "../ForgetPassword";
import * as authApiModule from "@/hooks/api/useAuth";
import toast from "react-hot-toast";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/api/useAuth", () => ({
  useForgotPassword: vi.fn(),
}));

describe("ForgetPassword Page Component", () => {
  let capturedMutationOptions;
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    vi.mocked(authApiModule.useForgotPassword).mockImplementation((options) => {
      capturedMutationOptions = options;
      return {
        mutate: mockMutate,
        isPending: false,
      };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("UI Rendering", () => {
    it("renders page header, email input, reset password button, and back to login link", () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      expect(screen.getByText("Forgot Password")).toBeInTheDocument();
      expect(
        screen.getByText("Enter your email to reset your password")
      ).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset password/i })
      ).toBeInTheDocument();

      const backLink = screen.getByRole("link", { name: /back to login/i });
      expect(backLink).toHaveAttribute("href", "/auth/signin");
    });
  });

  describe("Form Validation", () => {
    it("displays error message when submitting empty email", async () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const form = screen.getByPlaceholderText("Enter your email").closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("Email is required")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error message when invalid email format is entered", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "not-valid-email");

      const form = emailInput.closest("form");
      fireEvent.submit(form);

      expect(
        await screen.findByText("Enter a valid email address")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission & Success Redirection", () => {
    it("submits valid email and triggers forgotPassword mutation", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "official@whistleworks.com");

      const form = emailInput.closest("form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: "official@whistleworks.com",
        });
      });
    });

    it("handles success flow, saves verify_email and testing_purpose_otp in sessionStorage, and redirects to /auth/reset-password-otp after delay", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          message: "OTP sent to your inbox",
          data: {
            email: "official@whistleworks.com",
            otp: "9876",
          },
        },
      };

      capturedMutationOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("OTP sent to your inbox");
      expect(sessionStorage.getItem("verify_email")).toBe(
        "official@whistleworks.com"
      );
      expect(sessionStorage.getItem("testing_purpose_otp")).toBe("9876");

      vi.advanceTimersByTime(1500);
      expect(mockNavigate).toHaveBeenCalledWith("/auth/reset-password-otp");
    });
  });

  describe("Error Handling", () => {
    it("displays error toast on mutation failure", () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "User not found with this email",
          },
        },
      };

      capturedMutationOptions.onError(mockError);
      expect(toast.error).toHaveBeenCalledWith("User not found with this email");
    });

    it("displays default fallback error message when response message is missing", () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      capturedMutationOptions.onError({});
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong! Please try again."
      );
    });
  });

  describe("Loading State", () => {
    it("disables submit button and renders LoaderV2 when mutation isPending", () => {
      vi.mocked(authApiModule.useForgotPassword).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      const { container } = render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );

      const submitBtn = container.querySelector('button[type="submit"]');
      expect(submitBtn).toBeDisabled();
      expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
    });
  });
});
