import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAnnouncementService } from "../announcement.service";

const mockAxiosSecure = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("announcement.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends announcement payload to director announcement endpoint", () => {
    const { result } = renderHook(() => useAnnouncementService());
    const payload = { camp_id: "camp-1", message: "Meeting tomorrow" };

    result.current.sendAnnouncement(payload);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/director/announcement/store",
      payload
    );
  });
});
