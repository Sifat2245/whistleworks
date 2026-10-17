import { describe, it, expect } from "vitest";
import {
  SPORT_CONFIGS,
  DEFAULT_SPORT_CONFIG,
  normalizeSportName,
  getSportConfig,
  getSportIconComponent,
} from "../sportIcons";

describe("sportIcons utility", () => {
  describe("SPORT_CONFIGS", () => {
    it("should be a non-empty array of sports configurations", () => {
      expect(Array.isArray(SPORT_CONFIGS)).toBe(true);
      expect(SPORT_CONFIGS.length).toBeGreaterThan(0);
    });

    it("should have valid structure for each sport config", () => {
      SPORT_CONFIGS.forEach((config) => {
        expect(config).toHaveProperty("key");
        expect(config).toHaveProperty("keywords");
        expect(Array.isArray(config.keywords)).toBe(true);
        expect(config).toHaveProperty("icon");
        expect(config).toHaveProperty("label");
        expect(config).toHaveProperty("bgTint");
        expect(config).toHaveProperty("color");
      });
    });
  });

  describe("normalizeSportName", () => {
    it("should return empty string for falsy input or non-matching types", () => {
      expect(normalizeSportName("")).toBe("");
      expect(normalizeSportName(null)).toBe("");
      expect(normalizeSportName(undefined)).toBe("");
      expect(normalizeSportName(12345)).toBe("");
    });

    it("should normalize and trim string input", () => {
      expect(normalizeSportName("  Basketball  ")).toBe("basketball");
      expect(normalizeSportName("SOCCER")).toBe("soccer");
    });

    it("should extract sports name from object properties", () => {
      expect(normalizeSportName({ sports_type_name: "Football" })).toBe("football");
      expect(normalizeSportName({ sports_name: "Volleyball" })).toBe("volleyball");
      expect(normalizeSportName({ name: "Tennis" })).toBe("tennis");
      expect(normalizeSportName({ sports_type: "Baseball" })).toBe("baseball");
      expect(normalizeSportName({ title: "Swimming" })).toBe("swimming");
    });
  });

  describe("getSportConfig", () => {
    it("should return DEFAULT_SPORT_CONFIG for unknown or empty sport", () => {
      expect(getSportConfig("")).toBe(DEFAULT_SPORT_CONFIG);
      expect(getSportConfig("quidditch")).toBe(DEFAULT_SPORT_CONFIG);
    });

    it("should return correct configuration for basketball", () => {
      const config = getSportConfig("Basketball");
      expect(config.key).toBe("basketball");
      expect(config.label).toBe("Basketball");
    });

    it("should return correct configuration for soccer", () => {
      const config = getSportConfig("Men's Soccer League");
      expect(config.key).toBe("soccer");
    });

    it("should match sports from objects", () => {
      const config = getSportConfig({ sports_name: "Flag Football" });
      expect(config.key).toBe("football");
    });
  });

  describe("getSportIconComponent", () => {
    it("should return sport icon component for matched sport", () => {
      const icon = getSportIconComponent("Basketball");
      const config = getSportConfig("Basketball");
      expect(icon).toBe(config.icon);
    });

    it("should return default sport icon when unmatched and no fallback provided", () => {
      const icon = getSportIconComponent("UnknownSport");
      expect(icon).toBe(DEFAULT_SPORT_CONFIG.icon);
    });

    it("should return fallbackIcon when sport is default and fallback is provided", () => {
      const Fallback = () => null;
      const icon = getSportIconComponent("UnknownSport", Fallback);
      expect(icon).toBe(Fallback);
    });
  });
});
