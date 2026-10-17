import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBuildScheduleService } from "../buildSchedule.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("buildSchedule.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp date range", () => {
    const { result } = renderHook(() => useBuildScheduleService());
    result.current.getDateRange("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/camp/camp-1/date-range");
  });

  it("normalizes and sends create schedule payload", () => {
    const { result } = renderHook(() => useBuildScheduleService());
    const rawData = {
      game_duration: "60",
      max_referees_per_slot: "3",
      time_ranges: [{ date: "2025-06-01", start_time: "09:00", end_time: "17:00" }],
      locations: [
        {
          location_name: "Gym A",
          latitude: 34.05,
          longitude: -118.24,
          court_count: "4",
          address: "123 Main St",
        },
      ],
      referee_positions: ["Lead", "Trail"],
    };

    result.current.createSchedule("camp-1", rawData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith("/v1/camp/camp-1/schedule/create", {
      game_duration: 60,
      max_referees_per_slot: 3,
      time_ranges: [{ date: "2025-06-01", start_time: "09:00", end_time: "17:00" }],
      locations: [
        {
          location_name: "Gym A",
          latitude: "34.05",
          longitude: "-118.24",
          court_count: 4,
          address: "123 Main St",
        },
      ],
      referee_positions: ["Lead", "Trail"],
    });
  });

  it("publishes, clears, and deletes schedule", () => {
    const { result } = renderHook(() => useBuildScheduleService());

    result.current.publishSchedule("camp-1");
    expect(mockAxiosSecure.post).toHaveBeenCalledWith("/v1/camp/camp-1/schedule/publish");

    result.current.clearSchedule("sched-99");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/v1/director/court-assign/schedules/sched-99/clear-assignments"
    );

    result.current.deleteSchedule("camp-1");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith("/v1/camp/camp-1/schedule");
  });
});
