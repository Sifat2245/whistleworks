import { describe, expect, it } from "vitest";
import { formatScheduleTimezone } from "@/utils/scheduleTimezones";

describe("Scheduled timezone abbreviations", () => {
  it.each([
    ["America/New_York", "2026-01-15", "13:16:00", "EST"],
    ["America/New_York", "2026-07-15", "13:16:00", "EDT"],
    ["America/Chicago", "2026-01-15", "13:16:00", "CST"],
    ["America/Chicago", "2026-05-08", "13:16:00", "CDT"],
    ["America/New_York", "2026-03-08", "01:30:00", "EST"],
    ["America/New_York", "2026-03-08", "03:30:00", "EDT"],
  ])("formats %s on %s at %s as %s", (zone, date, time, expected) => {
    expect(formatScheduleTimezone(zone, date, time)).toBe(expected);
  });
  it("preserves UTC", () => {
    expect(formatScheduleTimezone("UTC", "2026-05-08", "13:16:00")).toBe("UTC");
  });
  it("uses a generic zone when the game date is missing", () => {
    expect(formatScheduleTimezone("America/Chicago")).toBe("CT");
    expect(formatScheduleTimezone("America/New_York")).toBe("ET");
  });
  it("keeps an invalid API zone readable without crashing", () => {
    expect(
      formatScheduleTimezone("Unknown/Zone", "2026-05-08", "13:16:00"),
    ).toBe("Unknown/Zone");
    expect(
      formatScheduleTimezone("America/Chicago", "2026-22-99", "13:16:00"),
    ).toBe("America/Chicago");
  });
  it("does not invent a timezone when none is supplied", () => {
    expect(formatScheduleTimezone(null, "2026-05-08", "13:16:00")).toBe("");
  });
});
