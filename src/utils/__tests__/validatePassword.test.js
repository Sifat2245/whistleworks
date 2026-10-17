import { describe, it, expect } from "vitest";
import { validatePassword, doPasswordsMatch } from "../validatePassword";

describe("validatePassword utility", () => {
  describe("validatePassword", () => {
    it("should return invalid when password is empty or falsy", () => {
      expect(validatePassword("")).toEqual({
        isValid: false,
        message: "Password is required",
      });
      expect(validatePassword(null)).toEqual({
        isValid: false,
        message: "Password is required",
      });
      expect(validatePassword(undefined)).toEqual({
        isValid: false,
        message: "Password is required",
      });
    });

    it("should return invalid when password is fewer than 6 characters", () => {
      expect(validatePassword("12345")).toEqual({
        isValid: false,
        message: "Password must be at least 6 characters",
      });
    });

    it("should return valid when password is 6 characters or longer", () => {
      expect(validatePassword("123456")).toEqual({
        isValid: true,
        message: "",
      });
      expect(validatePassword("SecurePass123!")).toEqual({
        isValid: true,
        message: "",
      });
    });
  });

  describe("doPasswordsMatch", () => {
    it("should return true when passwords match", () => {
      expect(doPasswordsMatch("Secret123", "Secret123")).toBe(true);
    });

    it("should return false when passwords do not match", () => {
      expect(doPasswordsMatch("Secret123", "DifferentPass")).toBe(false);
    });

    it("should handle empty or missing passwords", () => {
      expect(doPasswordsMatch("", "")).toBe(true);
      expect(doPasswordsMatch("pass", "")).toBe(false);
    });
  });
});
