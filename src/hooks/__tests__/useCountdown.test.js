import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useCountdown from "../useCountdown";

describe("useCountdown hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null if targetDate is not provided", () => {
    const { result } = renderHook(() => useCountdown(null));
    expect(result.current).toBeNull();
  });

  it("returns null if targetDate has already passed", () => {
    const pastDate = new Date(Date.now() - 10000).toISOString();
    const { result } = renderHook(() => useCountdown(pastDate));
    expect(result.current).toBeNull();
  });

  it("calculates remaining days, hours, minutes, and seconds correctly", () => {
    const now = Date.now();
    // 2 days, 3 hours, 4 minutes, 5 seconds in future
    const targetMs = now + (2 * 86400000 + 3 * 3600000 + 4 * 60000 + 5 * 1000);
    const targetDate = new Date(targetMs).toISOString();

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
  });

  it("updates countdown every second", () => {
    const now = Date.now();
    const targetMs = now + 10000; // 10 seconds in future
    const targetDate = new Date(targetMs).toISOString();

    const { result } = renderHook(() => useCountdown(targetDate));
    expect(result.current.seconds).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(9);
  });
});
