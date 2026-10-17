import { describe, it, expect } from "vitest";
import { maskEmail } from "../maskEmail";

describe("maskEmail utility", () => {
  it("should return empty string if email is falsy", () => {
    expect(maskEmail("")).toBe("");
    expect(maskEmail(null)).toBe("");
    expect(maskEmail(undefined)).toBe("");
  });

  it("should return original string if there is no '@' symbol", () => {
    expect(maskEmail("plainusername")).toBe("plainusername");
  });

  it("should mask email with first three letters and domain intact", () => {
    expect(maskEmail("john.doe@example.com")).toBe("joh***@example.com");
    expect(maskEmail("referee@whistleworks.org")).toBe("ref***@whistleworks.org");
  });

  it("should handle short usernames before '@'", () => {
    expect(maskEmail("ab@example.com")).toBe("ab***@example.com");
    expect(maskEmail("a@example.com")).toBe("a***@example.com");
  });
});
