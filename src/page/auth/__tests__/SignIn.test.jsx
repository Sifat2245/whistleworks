import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignIn from "../SignIn";
import * as useAuthModule from "@/hooks/useAuth";
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

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/api/useAuth", () => ({
  useSignIn: vi.fn(),
}));

describe("SignIn Page Component", () => {
  let capturedMutationOptions;
  const mockHandleLogin = vi.fn();
  const mockUserRefetch = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      handleLogin: mockHandleLogin,
      userRefetch: mockUserRefetch,
      isLoggedIn: false,
      userData: null,
    });

    vi.mocked(authApiModule.useSignIn).mockImplementation((options) => {
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
    it("renders welcome header, form fields, remember me, links, and submit button", () => {
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(
        screen.getByText("Sign in to access your Whistle Works dashboard")
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();

      const forgotPasswordLink = screen.getByRole("link", {
        name: /forgot password\?/i,
      });
      expect(forgotPasswordLink).toHaveAttribute("href", "/auth/forget-password");

      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toHaveAttribute("href", "/auth/signup");

      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("toggles password visibility when eye icon button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      expect(passwordInput).toHaveAttribute("type", "password");

      const toggleBtn = passwordInput.parentElement.querySelector("button");
      expect(toggleBtn).toBeInTheDocument();

      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Validation", () => {
    it("displays error messages when submitting empty form", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitBtn);

      expect(await screen.findByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays validation error when invalid email format is entered", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "not-an-email");

      const form = emailInput.closest("form");
      fireEvent.submit(form);

      expect(
        await screen.findByText("Enter a valid email address")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays validation error when password is less than 6 characters", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");

      await user.type(emailInput, "valid@whistleworks.com");
      await user.type(passwordInput, "12345");

      const form = emailInput.closest("form");
      fireEvent.submit(form);

      expect(
        await screen.findByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission & Success Redirection", () => {
    it("submits valid credentials and triggers signIn mutation", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");
      const rememberCheckbox = screen.getByLabelText(/remember me/i);

      await user.type(emailInput, "referee@whistleworks.com");
      await user.type(passwordInput, "password123");
      await user.click(rememberCheckbox);

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: "referee@whistleworks.com",
          password: "password123",
          rememberMe: true,
        });
      });
    });

    it("handles success flow and redirects director to /director-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          message: "Welcome back!",
          data: {
            token: "jwt-director-token",
            user: { role: "director" },
          },
        },
      };

      capturedMutationOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("Welcome back!");
      expect(mockHandleLogin).toHaveBeenCalledWith("jwt-director-token");
      expect(mockUserRefetch).toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith("/director-dashboard");
    });

    it("redirects evaluator to /evaluator-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-evaluator-token",
            user: { role: "evaluator" },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith("/evaluator-dashboard");
    });

    it("redirects referee to /referee-dashboard", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-referee-token",
            user: { role: "referee" },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith("/referee-dashboard");
    });

    it("redirects to '/' if user role is unknown or missing", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-token",
            user: { role: null },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("redirects to specific camp details when coming from a camp URL in location state", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/auth/signin",
              state: { from: "/camp/details/99" },
            },
          ]}
        >
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-token",
            user: { role: "referee" },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/referee-dashboard/camp/99?tab=camp-details"
      );
    });

    it("redirects director to camp-overview/:id when coming from camp URL in location state", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/auth/signin",
              state: { from: "/camp/details/88" },
            },
          ]}
        >
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-token",
            user: { role: "director" },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/director-dashboard/camp-overview/88"
      );
    });

    it("redirects evaluator to evaluator-dashboard/camp/:id when coming from camp URL in location state", () => {
      vi.useFakeTimers();
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/auth/signin",
              state: { from: "/camp/details/77" },
            },
          ]}
        >
          <SignIn />
        </MemoryRouter>
      );

      capturedMutationOptions.onSuccess({
        data: {
          data: {
            token: "jwt-token",
            user: { role: "evaluator" },
          },
        },
      });

      vi.advanceTimersByTime(1000);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/evaluator-dashboard/camp/77?tab=camp-details"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles general sign-in error with toast notification", () => {
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "Invalid credentials provided",
          },
        },
      };

      capturedMutationOptions.onError(mockError);
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials provided");
    });

    it("displays backend validation error message for invalid email on field and in toast", async () => {
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          status: 422,
          data: {
            status: false,
            message: "Validation failed",
            data: {
              email: ["The selected email is invalid."],
            },
            code: 422,
          },
        },
      };

      act(() => {
        capturedMutationOptions.onError(mockError);
      });

      expect(toast.error).toHaveBeenCalledWith("The selected email is invalid.");
      expect(
        await screen.findByText("The selected email is invalid.")
      ).toBeInTheDocument();
    });

    it("clears email error when user modifies the email input", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            status: false,
            message: "Validation failed",
            data: {
              email: ["The selected email is invalid."],
            },
            code: 422,
          },
        },
      };

      act(() => {
        capturedMutationOptions.onError(mockError);
      });
      expect(
        await screen.findByText("The selected email is invalid.")
      ).toBeInTheDocument();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "a");

      expect(
        screen.queryByText("The selected email is invalid.")
      ).not.toBeInTheDocument();
    });

    it("redirects to /auth/verify-otp and stores email when code is 403 and is_otp_verified is false", () => {
      render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            code: 403,
            data: {
              is_otp_verified: false,
            },
          },
        },
      };

      capturedMutationOptions.onError(mockError, {
        email: "unverified@whistleworks.com",
      });

      expect(toast.error).toHaveBeenCalledWith("Please verify your email first");
      expect(sessionStorage.getItem("verify_email")).toBe(
        "unverified@whistleworks.com"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/auth/verify-otp");
    });
  });

  describe("Loading State", () => {
    it("disables submit button and shows LoaderV2 when mutation isPending", () => {
      vi.mocked(authApiModule.useSignIn).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      const { container } = render(
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      );

      const submitBtn = container.querySelector('button[type="submit"]');
      expect(submitBtn).toBeDisabled();
      expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    });
  });
});
