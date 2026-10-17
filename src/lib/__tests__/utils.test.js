import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge basic class names", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("should handle conditional and falsy values", () => {
    const isHidden = false;
    expect(cn("base-class", isHidden && "hidden", null, undefined, "active")).toBe(
      "base-class active"
    );
  });

  it("should resolve Tailwind class conflicts using twMerge", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-red-500", "bg-emerald-600")).toBe("bg-emerald-600");
  });

  it("should handle arrays of classes and object syntax", () => {
    expect(cn(["btn", "btn-primary"], { active: true, disabled: false })).toBe(
      "btn btn-primary active"
    );
  });

  it("should return empty string when no arguments provided", () => {
    expect(cn()).toBe("");
  });
});
