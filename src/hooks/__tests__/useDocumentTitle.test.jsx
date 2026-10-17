import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import useDocumentTitle from "../useDocumentTitle";

describe("useDocumentTitle hook", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    document.title = "Initial Title";
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it("updates document title with formatted title", () => {
    renderHook(() => useDocumentTitle("Active Camps"));
    expect(document.title).toBe("Active Camps");
  });

  it("does not update title if empty or undefined", () => {
    renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe("Initial Title");
  });

  it("reverts to previous title on unmount by default", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Test Page"));
    expect(document.title).toBe("Test Page");

    unmount();
    expect(document.title).toBe("Initial Title");
  });

  it("retains title on unmount when retainOnUnmount is true", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Retained Page", true));
    expect(document.title).toBe("Retained Page");

    unmount();
    expect(document.title).toBe("Retained Page");
  });
});
