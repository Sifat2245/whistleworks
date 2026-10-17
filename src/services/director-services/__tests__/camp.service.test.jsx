import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCampService } from "../camp.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

const mockAxiosPublic = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));
vi.mock("@/hooks/useAxiosPublic", () => ({ default: () => mockAxiosPublic }));

describe("camp.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles queries: getMyCamps, getSportsTypes, getTimeZones, getAdminFee, getCampDetails, getCampEdit, previousCamp", () => {
    const { result } = renderHook(() => useCampService());

    result.current.getMyCamps(2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/director/camp/list?page=2");

    result.current.getSportsTypes();
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/v1/camp/sports-type");

    result.current.getTimeZones();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/timezones/available");

    result.current.getAdminFee();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/camp/admin/fee");

    result.current.getCampDetails("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/camp/details/camp-1");

    result.current.getCampEdit("camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/camp/edit/camp-1");

    result.current.previousCamp(1);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/v1/director/camp/previous-camps?page=1"
    );
  });

  it("handles camp mutations: createCamp, updateCamp, deleteCamp", () => {
    const { result } = renderHook(() => useCampService());
    const formData = new FormData();

    result.current.createCamp(formData);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith("/v1/camp/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    result.current.updateCamp({ id: "camp-1", formData });
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/v1/camp/update/camp-1",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    result.current.deleteCamp("camp-1");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith("/v1/camp/delete/camp-1");
  });

  it("handles assistant director management: getAllDirectors, assignAssistantDirector, assignedCampList, removeAssistantDirector", () => {
    const { result } = renderHook(() => useCampService());

    result.current.getAllDirectors("alex", "camp-1");
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/assistant-director/list?search=alex&camp_id=camp-1"
    );

    const assignPayload = { user_id: 5, camp_id: "camp-1" };
    result.current.assignAssistantDirector(assignPayload);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/assistant-director-permissions/assign",
      assignPayload
    );

    result.current.assignedCampList(2);
    expect(mockAxiosSecure.get).toHaveBeenCalledWith(
      "/assistant-director/camp/list?page=2"
    );

    result.current.removeAssistantDirector("asst-10", "camp-1");
    expect(mockAxiosSecure.delete).toHaveBeenCalledWith(
      "/assistant-director/camp/permission/remove?assistant_director_id=asst-10&camp_id=camp-1"
    );
  });
});
