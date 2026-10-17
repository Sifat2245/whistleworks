import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCampCrews,
  useCrewDetails,
  useAvailableRefereesForCrew,
  useCreateCrew,
  useUpdateCrew,
  useAddMembersToCrew,
  useRemoveMemberFromCrew,
  useDeleteCrew,
} from "../useCrews";

const mockGetCampCrews = vi.fn();
const mockGetCrewDetails = vi.fn();
const mockGetAvailableRefereesForCrew = vi.fn();
const mockCreateCrew = vi.fn();
const mockUpdateCrew = vi.fn();
const mockAddMembers = vi.fn();
const mockRemoveMember = vi.fn();
const mockDeleteCrew = vi.fn();

vi.mock("@/services/director-services/crew.service", () => ({
  useCrewService: () => ({
    getCampCrews: mockGetCampCrews,
    getCrewDetails: mockGetCrewDetails,
    getAvailableRefereesForCrew: mockGetAvailableRefereesForCrew,
    createCrew: mockCreateCrew,
    updateCrew: mockUpdateCrew,
    addMembersToCrew: mockAddMembers,
    removeMemberFromCrew: mockRemoveMember,
    deleteCrew: mockDeleteCrew,
  }),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "CrewsWrapper";
  return Wrapper;
};

describe("useCrews hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp crews, crew details, and available referees", async () => {
    mockGetCampCrews.mockResolvedValueOnce({
      data: { data: { crews: [{ id: 1, name: "Crew Alpha" }] } },
    });
    mockGetCrewDetails.mockResolvedValueOnce({
      data: { data: { id: 1, members: [] } },
    });
    mockGetAvailableRefereesForCrew.mockResolvedValueOnce({
      data: { data: [{ id: 10, name: "Referee Tom" }] },
    });

    const { result: crewsHook } = renderHook(() => useCampCrews(15), {
      wrapper: createWrapper(),
    });
    const { result: detailsHook } = renderHook(() => useCrewDetails(1), {
      wrapper: createWrapper(),
    });
    const { result: refHook } = renderHook(() => useAvailableRefereesForCrew(15, 1, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(crewsHook.current.isLoading).toBe(false));
    await waitFor(() => expect(detailsHook.current.isLoading).toBe(false));
    await waitFor(() => expect(refHook.current.isSuccess).toBe(true));

    expect(crewsHook.current.crewGroups).toEqual([{ id: 1, name: "Crew Alpha" }]);
    expect(detailsHook.current.crewDetails).toEqual({ id: 1, members: [] });
    expect(refHook.current.data.pages[0]).toEqual([{ id: 10, name: "Referee Tom" }]);
  });

  it("creates, updates, adds/removes members, and deletes crews", async () => {
    mockCreateCrew.mockResolvedValueOnce({ data: { message: "Created" } });
    mockUpdateCrew.mockResolvedValueOnce({ data: { message: "Updated" } });
    mockAddMembers.mockResolvedValueOnce({ data: { message: "Added" } });
    mockRemoveMember.mockResolvedValueOnce({ data: { message: "Removed" } });
    mockDeleteCrew.mockResolvedValueOnce({ data: { message: "Deleted" } });

    const { result: createHook } = renderHook(() => useCreateCrew(15), {
      wrapper: createWrapper(),
    });
    const { result: updateHook } = renderHook(() => useUpdateCrew(1, 15), {
      wrapper: createWrapper(),
    });
    const { result: addHook } = renderHook(() => useAddMembersToCrew(1, 15), {
      wrapper: createWrapper(),
    });
    const { result: removeHook } = renderHook(() => useRemoveMemberFromCrew(1), {
      wrapper: createWrapper(),
    });
    const { result: deleteHook } = renderHook(() => useDeleteCrew(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await createHook.current.mutateAsync({ name: "Crew 1" });
      await updateHook.current.mutateAsync({ name: "Crew Updated" });
      await addHook.current.mutateAsync({ member_ids: [1, 2] });
      await removeHook.current.mutateAsync(1);
      await deleteHook.current.mutateAsync({ crewId: 1 });
    });

    expect(mockCreateCrew).toHaveBeenCalledWith(15, { name: "Crew 1" });
    expect(mockUpdateCrew).toHaveBeenCalledWith(1, { name: "Crew Updated" });
    expect(mockAddMembers).toHaveBeenCalledWith(1, { member_ids: [1, 2] });
    expect(mockRemoveMember).toHaveBeenCalledWith(1, 1);
    expect(mockDeleteCrew).toHaveBeenCalledWith(1);
  });
});
