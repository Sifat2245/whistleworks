import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePublicCamps,
  usePublicCampDetails,
  useSportsTypes,
  useLocations,
} from "../useNoAuthCamps";

const mockGetCamps = vi.fn();
const mockGetCampDetails = vi.fn();
const mockGetSportsTypes = vi.fn();
const mockGetLocations = vi.fn();

vi.mock("@/services/noauth-camps.service", () => ({
  useNoAuthCampService: () => ({
    getCamps: mockGetCamps,
    getCampDetails: mockGetCampDetails,
    getSportsTypes: mockGetSportsTypes,
    getLocations: mockGetLocations,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "NoAuthCampsWrapper";
  return Wrapper;
};

describe("useNoAuthCamps hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and normalizes public camps with filters", async () => {
    mockGetCamps.mockResolvedValueOnce({
      data: {
        data: {
          camp_list: [
            {
              id: 10,
              camp_name: "Summer Camp",
              sports_type_name: "Basketball",
              location: "Orlando",
              price: "150.00",
            },
          ],
          pagination: { total: 1, current_page: 1 },
        },
      },
    });

    const filters = { location: "Orlando", page: 2 };
    const { result } = renderHook(() => usePublicCamps(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetCamps).toHaveBeenCalledWith({ location: "Orlando", page: 2 });
    expect(result.current.camps).toHaveLength(1);
    expect(result.current.camps[0].camp_name).toBe("Summer Camp");
    expect(result.current.pagination.total).toBe(1);
  });

  it("fetches public camp details by id", async () => {
    mockGetCampDetails.mockResolvedValueOnce({
      data: { data: { id: 10, name: "Details Camp" } },
    });

    const { result } = renderHook(() => usePublicCampDetails(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetCampDetails).toHaveBeenCalledWith(10);
    expect(result.current.data).toEqual({ id: 10, name: "Details Camp" });
  });

  it("fetches sports types and locations", async () => {
    mockGetSportsTypes.mockResolvedValueOnce({
      data: { data: [{ id: 1, name: "Basketball" }] },
    });
    mockGetLocations.mockResolvedValueOnce({
      data: { data: { location_list: ["Orlando, FL", "Dallas, TX"] } },
    });

    const { result: sportsHook } = renderHook(() => useSportsTypes(), {
      wrapper: createWrapper(),
    });
    const { result: locHook } = renderHook(() => useLocations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(sportsHook.current.isSuccess).toBe(true));
    await waitFor(() => expect(locHook.current.isSuccess).toBe(true));

    expect(sportsHook.current.data).toEqual([{ id: 1, name: "Basketball" }]);
    expect(locHook.current.data).toEqual(["Orlando, FL", "Dallas, TX"]);
  });
});
