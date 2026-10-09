import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../SignUp";
import * as authApiModule from "@/hooks/api/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}));

vi.mock("@/hooks/api/useAuth", () => ({
  useSignUp: vi.fn(),
}));

let mockAutocompleteInstance = null;
vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  Autocomplete: ({ children, onLoad, onPlaceChanged }) => {
    mockAutocompleteInstance = {
      getPlace: vi.fn(() => ({
        formatted_address: "123 Main St, Chicago, IL",
        geometry: { location: {} },
      })),
    };
    if (onLoad) {
      onLoad(mockAutocompleteInstance);
    }
    return (
      <div data-testid="autocomplete-wrapper" onClick={onPlaceChanged}>
        {children}
      </div>
    );
  },
}));

describe("SignUp Page Component", () => {
  let capturedSignUpOptions;
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    vi.mocked(authApiModule.useSignUp).mockImplementation((options) => {
      capturedSignUpOptions = options;
      return {
        mutate: mockMutate,
        isPending: false,
      };
    });
  });

  describe("UI Rendering & Initial State", () => {
    it("renders page header, role selection cards, input fields, checkboxes, and links", () => {
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      expect(screen.getByText("Create an Account")).toBeInTheDocument();
      expect(
        screen.getByText("Join Whistle Works to manage referee camps")
      ).toBeInTheDocument();

      // Role cards
      expect(screen.getByText("Camp Director")).toBeInTheDocument();
      expect(screen.getByText("Evaluator")).toBeInTheDocument();
      expect(screen.getByText("Referee")).toBeInTheDocument();

      // Input fields
      expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search address...")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();

      // Terms & SMS checkboxes
      expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/SMS/i)).toBeInTheDocument();

      // Sign In link
      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toHaveAttribute("href", "/auth/signin");
    });

    it("allows switching between role cards", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const directorCard = screen.getByText("Camp Director").closest("div.cursor-pointer");
      const evaluatorCard = screen.getByText("Evaluator").closest("div.cursor-pointer");

      expect(directorCard).toBeInTheDocument();
      expect(evaluatorCard).toBeInTheDocument();

      await user.click(directorCard);
      expect(directorCard).toHaveClass("border-primary");

      await user.click(evaluatorCard);
      expect(evaluatorCard).toHaveClass("border-primary");
    });
  });

  describe("Form Validation", () => {
    it("displays validation errors when required fields are missing", async () => {
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const form = screen.getByPlaceholderText("First name").closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("First name is required")).toBeInTheDocument();
      expect(screen.getByText("Last name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Address is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Confirm password")).toBeInTheDocument();
      expect(screen.getByText("You must agree to terms")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error when email format is invalid", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText("Email address");
      await user.type(emailInput, "invalid-email-address");

      const form = emailInput.closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("Valid email required")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error when password is less than 6 characters", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Password");
      await user.type(passwordInput, "123");

      const form = passwordInput.closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("At least 6 characters")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays error when confirm password does not match password", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password999");

      const form = passwordInput.closest("form");
      fireEvent.submit(form);

      expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission & Success Redirection", () => {
    it("submits valid form data with formatted SMS boolean, phone, and role", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      await user.type(screen.getByPlaceholderText("First name"), "John");
      await user.type(screen.getByPlaceholderText("Last name"), "Doe");
      await user.type(screen.getByPlaceholderText("Email address"), "john.doe@example.com");
      await user.type(screen.getByPlaceholderText("Phone number"), "3125550199");
      await user.type(screen.getByPlaceholderText("Search address..."), "123 Main St");
      await user.type(screen.getByPlaceholderText("Password"), "secret123");
      await user.type(screen.getByPlaceholderText("Confirm password"), "secret123");

      // Check Agree terms checkbox
      const checkboxes = screen.getAllByRole("checkbox");
      const agreeCheckbox = checkboxes[0];
      const smsCheckbox = checkboxes[1];

      await user.click(agreeCheckbox);
      await user.click(smsCheckbox);

      const form = screen.getByPlaceholderText("First name").closest("form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockMutate.mock.calls[0][0];
      expect(submittedData.first_name).toBe("John");
      expect(submittedData.last_name).toBe("Doe");
      expect(submittedData.email).toBe("john.doe@example.com");
      expect(submittedData.receive_sms_notifications).toBe(1);
      expect(submittedData.role).toBe(4);
    });

    it("handles success flow, saves verify_email in sessionStorage, and navigates to /auth/verify-otp", () => {
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          message: "Registration successful",
          data: {
            email: "john.doe@example.com",
          },
        },
      };

      capturedSignUpOptions.onSuccess(mockResponse);

      expect(toast.success).toHaveBeenCalledWith("Registration successful");
      expect(sessionStorage.getItem("verify_email")).toBe("john.doe@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/auth/verify-otp");
    });

    it("saves intended camp redirection in sessionStorage when redirected from camp details", () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/auth/signup",
              state: { from: "/camp/details/108" },
            },
          ]}
        >
          <SignUp />
        </MemoryRouter>
      );

      const mockResponse = {
        data: {
          data: {
            email: "referee@example.com",
          },
        },
      };

      capturedSignUpOptions.onSuccess(mockResponse);

      expect(sessionStorage.getItem("intended_camp_id")).toBe("108");
      expect(sessionStorage.getItem("intended_from_signup")).toBe("true");
      expect(mockNavigate).toHaveBeenCalledWith("/auth/verify-otp");
    });
  });

  describe("Google Places Autocomplete Integration", () => {
    it("updates address field when Google Places place changes", () => {
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const autocompleteWrapper = screen.getByTestId("autocomplete-wrapper");
      fireEvent.click(autocompleteWrapper);

      const addressInput = screen.getByPlaceholderText("Search address...");
      expect(addressInput).toHaveValue("123 Main St, Chicago, IL");
    });
  });

  describe("Error Handling", () => {
    it("shows SweetAlert confirmation and navigates to signin when email already exists", async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/auth/signup",
              state: { from: "/camp/details/10" },
            },
          ]}
        >
          <SignUp />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "The email has already been taken.",
            "t-errors": {
              email: ["The email has already been taken."],
            },
          },
        },
      };

      capturedSignUpOptions.onError(mockError);

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "warning",
          title: "Account Already Exists",
          confirmButtonText: "Sign In",
        })
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/auth/signin", {
          state: { from: "/camp/details/10" },
        });
      });
    });

    it("shows toast error for other API errors", () => {
      render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const mockError = {
        response: {
          data: {
            message: "Internal server error occurred",
          },
        },
      };

      capturedSignUpOptions.onError(mockError);

      expect(toast.error).toHaveBeenCalledWith("Internal server error occurred");
    });
  });

  describe("Loading State", () => {
    it("disables submit button and shows LoaderV2 when signUpMutation is pending", () => {
      vi.mocked(authApiModule.useSignUp).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      const { container } = render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );

      const submitBtn = container.querySelector('button[type="submit"]');
      expect(submitBtn).toBeDisabled();
      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });
  });
});
