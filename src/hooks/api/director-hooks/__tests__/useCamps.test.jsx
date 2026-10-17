import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetMyCamp,
  useGetSportsTypes,
  useGetTimeZones,
  useGetAdminFee,
  useCreateCamp,
  useGetCampDetails,
  useUpdateCamp,
  useDeleteCamp,
  useGetPreviousCamps,
  useGetAllDirectors,
  useGetAssignedCamps,
} from "../useCamps";

const mockGetMyCamps = vi.fn();
const mockGetSportsTypes = vi.fn();
const mockGetTimeZones = vi.fn();
const mockGetAdminFee = vi.fn();
const mockCreateCamp = vi.fn();
const mockGetCampDetails = vi.fn();
const mockUpdateCamp = vi.fn();
const mockDeleteCamp = vi.fn();
const mockPreviousCamp = vi.fn();
const mockGetAllDirectors = vi.fn();
const mockAssignedCampList = vi.fn();

vi.mock("@/services/director-services/camp.service", () => ({
  useCampService: () => ({
    getMyCamps: mockGetMyCamps,
    getSportsTypes: mockGetSportsTypes,
    getTimeZones: mockGetTimeZones,
    getAdminFee: mockGetAdminFee,
    createCamp: mockCreateCamp,
    getCampDetails: mockGetCampDetails,
    updateCamp: mockUpdateCamp,
    deleteCamp: mockDeleteCamp,
    previousCamp: mockPreviousCamp,
    getAllDirectors: mockGetAllDirectors,
    assignedCampList: mockAssignedCampList,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "CampsWrapper";
  return Wrapper;
};

describe("useCamps hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches director's camps and sports types", async () => {
    mockGetMyCamps.mockResolvedValueOnce({
      data: { data: { camp_list: [{ id: 1, name: "Camp 1" }], pagination: { total: 1 } } },
    });
    mockGetSportsTypes.mockResolvedValueOnce({
      data: { data: [{ id: 1, sports_name: "Basketball", sports_fee: "15.00" }] },
    });

    const { result: campsHook } = renderHook(() => useGetMyCamp(1), {
      wrapper: createWrapper(),
    });
    const { result: sportsHook } = renderHook(() => useGetSportsTypes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(campsHook.current.campCartLoading).toBe(false));
    await waitFor(() => expect(sportsHook.current.isSuccess).toBe(true));

    expect(campsHook.current.camps).toEqual([{ id: 1, name: "Camp 1" }]);
    expect(sportsHook.current.data).toEqual([
      { label: "Basketball", value: 1, sports_fee: "15.00" },
    ]);
  });

  it("fetches camp details, timezones, and admin fee", async () => {
    mockGetCampDetails.mockResolvedValueOnce({
      data: { data: { id: 10, name: "Camp 10" } },
    });
    mockGetTimeZones.mockResolvedValueOnce({
      data: { data: { timezones: ["America/Chicago", "America/New_York"] } },
    });
    mockGetAdminFee.mockResolvedValueOnce({
      data: { data: { admin_fee: "5.00" } },
    });

    const { result: detailsHook } = renderHook(() => useGetCampDetails(10), {
      wrapper: createWrapper(),
    });
    const { result: tzHook } = renderHook(() => useGetTimeZones(), {
      wrapper: createWrapper(),
    });
    const { result: feeHook } = renderHook(() => useGetAdminFee(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(detailsHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(tzHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(feeHook.current.isSuccess).toBe(true));

    expect(detailsHook.current.data).toEqual({ id: 10, name: "Camp 10" });
    expect(tzHook.current.data).toEqual(["America/Chicago", "America/New_York"]);
    expect(feeHook.current.data).toBe("5.00");
  });

  it("executes create, update, and delete camp mutations", async () => {
    mockCreateCamp.mockResolvedValueOnce({ data: { message: "Created" } });
    mockUpdateCamp.mockResolvedValueOnce({ data: { message: "Updated" } });
    mockDeleteCamp.mockResolvedValueOnce({ data: { message: "Deleted" } });

    const { result: createHook } = renderHook(() => useCreateCamp(), {
      wrapper: createWrapper(),
    });
    const { result: updateHook } = renderHook(() => useUpdateCamp(), {
      wrapper: createWrapper(),
    });
    const { result: deleteHook } = renderHook(() => useDeleteCamp(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await createHook.current.mutateAsync({ name: "New Camp" });
      await updateHook.current.mutateAsync({ id: 10, data: {} });
      await deleteHook.current.mutateAsync(10);
    });

    expect(mockCreateCamp.mock.calls[0][0]).toEqual({ name: "New Camp" });
    expect(mockUpdateCamp.mock.calls[0][0]).toEqual({ id: 10, data: {} });
    expect(mockDeleteCamp.mock.calls[0][0]).toBe(10);
  });

  it("fetches previous camps and assistant directors", async () => {
    mockPreviousCamp.mockResolvedValueOnce({
      data: { data: { previous_camps: [{ id: 5, name: "Camp 5" }], pagination: { total: 1 } } },
    });
    mockGetAllDirectors.mockResolvedValueOnce({
      data: { data: [{ id: 9, name: "Assistant Bob" }] },
    });
    mockAssignedCampList.mockResolvedValueOnce({
      data: { data: { camp_list: [{ id: 8 }], pagination: { total: 1 } } },
    });

    const { result: prevHook } = renderHook(() => useGetPreviousCamps(1), {
      wrapper: createWrapper(),
    });
    const { result: dirHook } = renderHook(() => useGetAllDirectors("Bob", 1), {
      wrapper: createWrapper(),
    });
    const { result: assignedHook } = renderHook(() => useGetAssignedCamps(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(prevHook.current.isLoading).toBe(false));
    await waitFor(() => expect(dirHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(assignedHook.current.isSuccess).toBe(true));

    expect(prevHook.current.previousCamps).toHaveLength(1);
    expect(dirHook.current.data).toEqual([{ id: 9, name: "Assistant Bob" }]);
    expect(assignedHook.current.data.camp_list).toEqual([{ id: 8 }]);
  });
});
