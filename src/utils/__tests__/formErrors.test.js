import { describe, it, expect, vi } from "vitest";
import { extractValidationErrors, getErrorMessage } from "../formErrors";

describe("formErrors utility", () => {
  describe("extractValidationErrors", () => {
    it("returns null firstMessage and empty fieldErrors if errorResponse is null/undefined", () => {
      expect(extractValidationErrors(null)).toEqual({
        firstMessage: null,
        fieldErrors: {},
      });
      expect(extractValidationErrors(undefined)).toEqual({
        firstMessage: null,
        fieldErrors: {},
      });
    });

    it("extracts error from data object (e.g. 422 Laravel response)", () => {
      const errorResponse = {
        status: false,
        message: "Validation failed",
        data: {
          email: ["The selected email is invalid."],
        },
        code: 422,
      };

      const mockSetError = vi.fn();
      const result = extractValidationErrors(errorResponse, mockSetError);

      expect(result.firstMessage).toBe("The selected email is invalid.");
      expect(result.fieldErrors).toEqual({
        email: "The selected email is invalid.",
      });
      expect(mockSetError).toHaveBeenCalledWith("email", {
        type: "server",
        message: "The selected email is invalid.",
      });
    });

    it("extracts errors from errors object", () => {
      const errorResponse = {
        message: "Validation failed",
        errors: {
          password: ["Password must be at least 6 characters."],
        },
      };

      const result = extractValidationErrors(errorResponse);
      expect(result.firstMessage).toBe("Password must be at least 6 characters.");
      expect(result.fieldErrors.password).toBe("Password must be at least 6 characters.");
    });

    it("extracts errors from t-errors object", () => {
      const errorResponse = {
        message: "Validation failed",
        "t-errors": {
          email: ["Email already in use."],
        },
      };

      const result = extractValidationErrors(errorResponse);
      expect(result.firstMessage).toBe("Email already in use.");
      expect(result.fieldErrors.email).toBe("Email already in use.");
    });

    it("handles multiple field errors and extracts all", () => {
      const errorResponse = {
        data: {
          email: ["The selected email is invalid."],
          password: ["Password is required."],
        },
      };

      const mockSetError = vi.fn();
      const result = extractValidationErrors(errorResponse, mockSetError);

      expect(result.firstMessage).toBe("The selected email is invalid.");
      expect(result.fieldErrors).toEqual({
        email: "The selected email is invalid.",
        password: "Password is required.",
      });
      expect(mockSetError).toHaveBeenCalledTimes(2);
    });

    it("handles string messages instead of arrays", () => {
      const errorResponse = {
        data: {
          email: "Invalid email",
        },
      };

      const result = extractValidationErrors(errorResponse);
      expect(result.firstMessage).toBe("Invalid email");
      expect(result.fieldErrors.email).toBe("Invalid email");
    });
  });

  describe("getErrorMessage", () => {
    it("returns specific validation error message if present in data", () => {
      const err = {
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

      const mockSetError = vi.fn();
      const message = getErrorMessage(err, mockSetError, "Sign in failed");

      expect(message).toBe("The selected email is invalid.");
      expect(mockSetError).toHaveBeenCalledWith("email", {
        type: "server",
        message: "The selected email is invalid.",
      });
    });

    it("returns response.data.message when there are no field validation errors", () => {
      const err = {
        response: {
          data: {
            message: "Invalid credentials provided",
          },
        },
      };

      const message = getErrorMessage(err, null, "Sign in failed");
      expect(message).toBe("Invalid credentials provided");
    });

    it("returns string data if response.data is a string", () => {
      const err = {
        response: {
          data: "Server error occurred",
        },
      };

      const message = getErrorMessage(err, null, "Sign in failed");
      expect(message).toBe("Server error occurred");
    });

    it("returns fallback message if error response is empty", () => {
      const err = {};
      const message = getErrorMessage(err, null, "Sign in failed");
      expect(message).toBe("Sign in failed");
    });
  });
});
