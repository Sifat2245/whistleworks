import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCrewService } from "../crew.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("crew.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp crews, crew details, and available referees for crew", () => {
    const { result } = renderHook(() => useCrewService());

    result.current.getCampCrews("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/camp/camp-1/crews");

    result.current.getCrewDetails("crew-10");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/crew/crew-10");

    result.current.getAvailableRefereesForCrew("camp-1", 2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/camp/camp-1/available-referees-for-crew",
      { params: { page: 2 } }
    );
  });

  it("handles creating, updating, adding members, removing member, and deleting crew", () => {
    const { result } = renderHook(() => useCrewService());

    const newCrew = { name: "Crew Alpha", referee_ids: [1, 2] };
    result.current.createCrew("camp-1", newCrew);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/camp/camp-1/crew/create",
      newCrew
    );

    const updateData = { name: "Crew Beta" };
    result.current.updateCrew("crew-10", updateData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/crew/update/crew-10",
      updateData
    );

    const membersData = { referee_ids: [3, 4] };
    result.current.addMembersToCrew("crew-10", membersData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/crew/crew-10/add-members",
      membersData
    );

    result.current.removeMemberFromCrew("crew-10", 3);
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/v1/crew/crew-10/remove-members",
      { params: { referee_ids: [3] } }
    );

    result.current.deleteCrew("crew-10");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith("/v1/crew/delete/crew-10");
  });
});
