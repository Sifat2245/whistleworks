import { describe, it, expect } from "vitest";
import { formatDate, getDurationDays, formatPrice } from "../campFormat";

describe("campFormat utility", () => {
  describe("formatDate", () => {
    it("should return 'TBA' when date string is missing or empty", () => {
      expect(formatDate("")).toBe("TBA");
      expect(formatDate(null)).toBe("TBA");
      expect(formatDate(undefined)).toBe("TBA");
    });

    it("should return original string when date is invalid", () => {
      expect(formatDate("not-a-valid-date")).toBe("not-a-valid-date");
    });

    it("should format valid ISO date to 'MMM D, YYYY'", () => {
      expect(formatDate("2025-06-15")).toBe("Jun 15, 2025");
      expect(formatDate("2025-12-01T00:00:00Z")).toBe("Dec 1, 2025");
    });
  });

  describe("getDurationDays", () => {
    it("should return null if start or end is missing", () => {
      expect(getDurationDays(null, "2025-06-15")).toBeNull();
      expect(getDurationDays("2025-06-15", null)).toBeNull();
      expect(getDurationDays("", "")).toBeNull();
    });

    it("should return null if start or end date is invalid", () => {
      expect(getDurationDays("invalid-date", "2025-06-15")).toBeNull();
      expect(getDurationDays("2025-06-15", "invalid-date")).toBeNull();
    });

    it("should return 1 for same-day start and end", () => {
      expect(getDurationDays("2025-06-15", "2025-06-15")).toBe(1);
    });

    it("should calculate correct duration in days inclusive", () => {
      expect(getDurationDays("2025-06-15", "2025-06-18")).toBe(4);
    });

    it("should return null if end date is before start date", () => {
      expect(getDurationDays("2025-06-20", "2025-06-15")).toBeNull();
    });
  });

  describe("formatPrice", () => {
    it("should return '—' for missing, null, undefined, empty, or 'N/A' prices", () => {
      expect(formatPrice(undefined)).toBe("—");
      expect(formatPrice(null)).toBe("—");
      expect(formatPrice("")).toBe("—");
      expect(formatPrice("N/A")).toBe("—");
    });

    it("should return '—' for non-numeric strings", () => {
      expect(formatPrice("abc")).toBe("—");
    });

    it("should return 'Free' for 0 or '0'", () => {
      expect(formatPrice(0)).toBe("Free");
      expect(formatPrice("0")).toBe("Free");
      expect(formatPrice(0.0)).toBe("Free");
    });

    it("should format positive prices with currency symbol and 2 decimals", () => {
      expect(formatPrice(150)).toBe("$150.00");
      expect(formatPrice("150.5")).toBe("$150.50");
      expect(formatPrice(1250)).toBe("$1,250.00");
    });
  });
});
