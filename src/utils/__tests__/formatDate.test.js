import { describe, it, expect } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate utility", () => {
  it("should return '00-00-00' when dateString is empty or falsy", () => {
    expect(formatDate("")).toBe("00-00-00");
    expect(formatDate(null)).toBe("00-00-00");
    expect(formatDate(undefined)).toBe("00-00-00");
  });

  it("should format valid date string as YYYY-MM-DD", () => {
    const formatted = formatDate("2025-06-15T12:00:00");
    expect(formatted).toMatch(/^2025-06-15$/);
  });

  it("should pad single digit month and day with zero", () => {
    const formatted = formatDate("2025-01-05T12:00:00");
    expect(formatted).toBe("2025-01-05");
  });
});
