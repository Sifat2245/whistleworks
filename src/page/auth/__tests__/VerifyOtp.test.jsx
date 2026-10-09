import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerifyOtp from "../VerifyOtp";
import * as authApiModule from "@/hooks/api/useAuth";
import * as useAuthModule from "@/hooks/useAuth";
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

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/api/useAuth", () => ({
  useVerifyEmail: vi.fn(),
  useResendOtp: vi.fn(),
}));

describe("VerifyOtp Page Component", () => {
  let capturedVerifyOptions;
  let capturedResendOptions;
  const mockHandleLogin = vi.fn();
  const mockUserRefetch = vi.fn();
  const mockVerifyMutate = vi.fn();
  const mockResendMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("verify_email", "referee@whistleworks.com");

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      handleLogin: mockHandleLogin,
      userRefetch: mockUserRefetch,
      isLoggedIn: false,
      userData: null,
    });

    vi.mocked(authApiModule.useVerifyEmail).mockImplementation((options) => {
      capturedVerifyOptions = options;
      return {
        mutate: mockVerifyMutate,
        isPending: false,
      };
    });

    vi.mocked(authApiModule.useResendOtp).mockImplementation((options) => {
      capturedResendOptions = options;
      return {
        mutate: mockResendMutate,
        isPending: false,
      };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("UI Rendering", () => {
    it("renders verify otp header, instructions, masked email, otp input, and countdown", () => {
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      expect(screen.getByText("Verify OTP")).toBeInTheDocument();
      expect(
        screen.getByText("Enter the 4-digit code sent to your email")
      ).toBeInTheDocument();
      expect(screen.getByText("Sent to")).toBeInTheDocument();
      expect(screen.getByText("ref***@whistleworks.com")).toBeInTheDocument();
      expect(
        screen.getByText(/Didn't receive the code\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /continue/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Resend in \d+s/i)).toBeInTheDocument();
    });
  });

  describe("Validation & Verification Flow", () => {
    it("shows error when OTP is not 4 digits", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      expect(
        screen.getByText("Please enter a valid 4-digit code")
      ).toBeInTheDocument();
      expect(mockVerifyMutate).not.toHaveBeenCalled();
    });

    it("triggers verifyMutation with email and 4-digit OTP", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      const otpInputs = screen.getAllByRole("textbox");
      fireEvent.input(otpInputs[0], { target: { value: "5678" } });

      const continueBtn = screen.getByRole("button", { name: /continue/i });
      await user.click(continueBtn);

      expect(mockVerifyMutate).toHaveBeenCalledWith({
        email: "referee@whistleworks.com",
        otp: "5678",
      });
    });

    it("handles success flow and redirects director to /director-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          token: "jwt-verified-token",
          message: "OTP verification successful",
          data: {
            role: "director",
          },
        },
      };

      capturedVerifyOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("OTP verification successful");
      expect(mockHandleLogin).toHaveBeenCalledWith("jwt-verified-token");
      expect(mockUserRefetch).toHaveBeenCalled();
      expect(sessionStorage.getItem("verify_email")).toBeNull();

      vi.advanceTimersByTime(900);
      expect(mockNavigate).toHaveBeenCalledWith("/director-dashboard", {
        replace: true,
      });
    });

    it("redirects evaluator to /evaluator-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedVerifyOptions.onSuccess({
        data: {
          token: "jwt-token",
          data: { role: "evaluator" },
        },
      });

      vi.advanceTimersByTime(900);
      expect(mockNavigate).toHaveBeenCalledWith("/evaluator-dashboard", {
        replace: true,
      });
    });

    it("redirects referee to /referee-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedVerifyOptions.onSuccess({
        data: {
          token: "jwt-token",
          data: { role: "referee" },
        },
      });

      vi.advanceTimersByTime(900);
      expect(mockNavigate).toHaveBeenCalledWith("/referee-dashboard", {
        replace: true,
      });
    });

    it("redirects to intended camp if intended_camp_id is present in sessionStorage", () => {
      vi.useFakeTimers();
      sessionStorage.setItem("intended_camp_id", "44");

      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedVerifyOptions.onSuccess({
        data: {
          token: "jwt-token",
          data: { role: "referee" },
        },
      });

      expect(sessionStorage.getItem("intended_camp_id")).toBeNull();

      vi.advanceTimersByTime(900);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/referee-dashboard/camp/44?tab=camp-details",
        { replace: true }
      );
    });

    it("redirects director to camp-overview/:id when intended_camp_id is present", () => {
      vi.useFakeTimers();
      sessionStorage.setItem("intended_camp_id", "55");

      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedVerifyOptions.onSuccess({
        data: {
          token: "jwt-token",
          data: { role: "director" },
        },
      });

      vi.advanceTimersByTime(900);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/director-dashboard/camp-overview/55",
        { replace: true }
      );
    });
  });

  describe("Resend OTP Flow", () => {
    it("enables resend link after countdown completes and calls resendMutation on click", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      expect(screen.getByText(/Resend in 30s/i)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(31000);
      });

      const resendBtn = screen.getByText("Resend");
      expect(resendBtn).toBeInTheDocument();
      fireEvent.click(resendBtn);

      expect(mockResendMutate).toHaveBeenCalled();
    });

    it("handles resendMutation success", () => {
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedResendOptions.onSuccess({
        data: { message: "New OTP sent. Check your email." },
      });

      expect(toast.success).toHaveBeenCalledWith(
        "New OTP sent. Check your email."
      );
    });

    it("handles resendMutation error", () => {
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedResendOptions.onError({
        response: { data: { message: "Rate limit reached" } },
      });

      expect(toast.error).toHaveBeenCalledWith("Rate limit reached");
    });
  });

  describe("Error Handling", () => {
    it("displays error toast on verification error", () => {
      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      capturedVerifyOptions.onError({
        response: { data: { message: "Invalid or expired OTP" } },
      });

      expect(toast.error).toHaveBeenCalledWith("Invalid or expired OTP");
    });
  });

  describe("Loading State", () => {
    it("disables continue button and renders LoaderV2 when verifyMutation isPending", () => {
      vi.mocked(authApiModule.useVerifyEmail).mockReturnValue({
        mutate: mockVerifyMutate,
        isPending: true,
      });

      render(
        <MemoryRouter>
          <VerifyOtp />
        </MemoryRouter>
      );

      const continueBtn = screen.getByRole("button");
      expect(continueBtn).toBeDisabled();
      expect(screen.queryByText("Continue")).not.toBeInTheDocument();
    });
  });
});
