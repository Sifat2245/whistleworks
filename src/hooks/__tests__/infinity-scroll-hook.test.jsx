import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useInfiniteScroll from "../infinity-scroll-hook";

describe("useInfiniteScroll hook", () => {
  it("initializes visibleCount with itemsPerPage", () => {
    const { result } = renderHook(() => useInfiniteScroll(50, 15));
    expect(result.current.visibleCount).toBe(15);
  });

  it("resets visibleCount when reset() is called", () => {
    const { result } = renderHook(() => useInfiniteScroll(100, 10));

    act(() => {
      result.current.reset();
    });

    expect(result.current.visibleCount).toBe(10);
  });

  it("provides loaderRef and scrollContainerRef refs", () => {
    const { result } = renderHook(() => useInfiniteScroll(25, 10));
    expect(result.current.loaderRef).toBeDefined();
    expect(result.current.scrollContainerRef).toBeDefined();
  });
});
