import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../ResetPassword";
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
  useResetPassword: vi.fn(),
}));

describe("ResetPassword Page Component", () => {
  let capturedMutationOptions;
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("reset_token", "sample-reset-token-123");
    sessionStorage.setItem("verify_email", "user@whistleworks.com");
    sessionStorage.setItem("testing_purpose_otp", "1234");

    vi.mocked(authApiModule.useResetPassword).mockImplementation((options) => {
      capturedMutationOptions = options;
      return {
        mutate: mockMutate,
        isPending: false,
      };
    });
  });

  describe("UI Rendering", () => {
    it("renders header, password inputs, submit button, and back to login link", () => {
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      expect(
        screen.getByRole("heading", { name: /reset password/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Enter your new password to continue")
      ).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Enter new password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset password/i })
      ).toBeInTheDocument();

      const backLink = screen.getByRole("link", { name: /back to login/i });
      expect(backLink).toHaveAttribute("href", "/auth/signin");
    });
  });

  describe("Form Validation", () => {
    it("displays error messages when required password fields are empty", async () => {
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const form = screen.getByPlaceholderText("Enter new password").closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("New password is required")).toBeInTheDocument();
      expect(screen.getByText("Please confirm your password")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error message when new password is less than 6 characters", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Enter new password");
      await user.type(passwordInput, "123");

      const form = passwordInput.closest("form");
      fireEvent.submit(form);

      expect(
        await screen.findByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error message when passwords do not match", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Enter new password");
      const confirmInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(passwordInput, "newPassword123");
      await user.type(confirmInput, "differentPassword");

      const form = passwordInput.closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission & Success Redirection", () => {
    it("submits valid passwords along with sessionStorage token and email", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Enter new password");
      const confirmInput = screen.getByPlaceholderText("Confirm new password");

      await user.type(passwordInput, "safePassword123");
      await user.type(confirmInput, "safePassword123");

      const form = passwordInput.closest("form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          token: "sample-reset-token-123",
          email: "user@whistleworks.com",
          password: "safePassword123",
          password_confirmation: "safePassword123",
        });
      });
    });

    it("handles success flow, clears sessionStorage items, and navigates to /auth/signin", () => {
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          message: "Password reset successfully",
        },
      };

      capturedMutationOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("Password reset successfully");
      expect(sessionStorage.getItem("reset_token")).toBeNull();
      expect(sessionStorage.getItem("verify_email")).toBeNull();
      expect(sessionStorage.getItem("testing_purpose_otp")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin");
    });
  });

  describe("Error Handling", () => {
    it("displays error toast on reset password failure", () => {
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "Token has expired",
          },
        },
      };

      capturedMutationOptions.onError(mockError);
      expect(toast.error).toHaveBeenCalledWith("Token has expired");
    });

    it("displays fallback error message when response message is not provided", () => {
      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      capturedMutationOptions.onError({});
      expect(toast.error).toHaveBeenCalledWith("OTP verification failed");
    });
  });

  describe("Loading State", () => {
    it("disables submit button and renders LoaderV2 when mutation is pending", () => {
      vi.mocked(authApiModule.useResetPassword).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      const { container } = render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      const submitBtn = container.querySelector('button[type="submit"]');
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).not.toHaveTextContent("Reset Password");
    });
  });
});
