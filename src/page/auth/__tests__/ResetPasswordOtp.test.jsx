import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResetPasswordOtp from "../ResetPasswordOtp";
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
  useVerifyResetOtp: vi.fn(),
}));

describe("ResetPasswordOtp Page Component", () => {
  let capturedMutationOptions;
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("verify_email", "john.official@example.com");

    vi.mocked(authApiModule.useVerifyResetOtp).mockImplementation((options) => {
      capturedMutationOptions = options;
      return {
        mutate: mockMutate,
        isPending: false,
      };
    });
  });

  describe("UI Rendering", () => {
    it("renders verify otp title, instructions, masked email, otp input, continue button, and resend info", () => {
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      expect(screen.getByText("Verify OTP")).toBeInTheDocument();
      expect(
        screen.getByText("Enter the 4-digit code sent to your email or phone")
      ).toBeInTheDocument();
      expect(screen.getByText("Please check on your email")).toBeInTheDocument();
      expect(
        screen.getByText("joh***@example.com")
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /continue/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Didn’t receive code\?/i)).toBeInTheDocument();
    });
  });

  describe("Validation & Submission", () => {
    it("displays error when OTP length is not 4 digits and continue button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      expect(
        screen.getByText("Please enter a valid 4-digit code")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("triggers mutation with OTP and email when valid 4-digit OTP is entered", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      const otpInputs = screen.getAllByRole("textbox");
      fireEvent.input(otpInputs[0], { target: { value: "1234" } });

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      expect(mockMutate).toHaveBeenCalledWith({
        otp: "1234",
        email: "john.official@example.com",
      });
    });

    it("handles success flow, saves reset_token in sessionStorage, and navigates to /auth/reset-password", () => {
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          token: "reset-jwt-token-xyz",
          message: "Code verified successfully",
        },
      };

      capturedMutationOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("Code verified successfully");
      expect(sessionStorage.getItem("reset_token")).toBe("reset-jwt-token-xyz");
      expect(mockNavigate).toHaveBeenCalledWith("/auth/reset-password");
    });
  });

  describe("Error Handling", () => {
    it("displays error toast on verification failure", () => {
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "Invalid OTP code provided",
          },
        },
      };

      capturedMutationOptions.onError(mockError);
      expect(toast.error).toHaveBeenCalledWith("Invalid OTP code provided");
    });

    it("displays fallback error toast when error response message is missing", () => {
      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      capturedMutationOptions.onError({});
      expect(toast.error).toHaveBeenCalledWith("OTP verification failed");
    });
  });

  describe("Loading State", () => {
    it("disables continue button and shows LoaderV2 when mutation isPending", () => {
      vi.mocked(authApiModule.useVerifyResetOtp).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      render(
        <MemoryRouter>
          <ResetPasswordOtp />
        </MemoryRouter>
      );

      const continueBtn = screen.getByRole("button");
      expect(continueBtn).toBeDisabled();
      expect(screen.queryByText("Continue")).not.toBeInTheDocument();
    });
  });
});
