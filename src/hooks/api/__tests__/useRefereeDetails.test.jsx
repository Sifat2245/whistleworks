import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetRefereeDetails } from "../useRefereeDetails";

const mockGetRefereeDetails = vi.fn();

vi.mock("@/services/refereeDetails.service", () => ({
  useRefereeDetailsService: () => ({
    getRefereeDetails: mockGetRefereeDetails,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RefereeDetailsWrapper";
  return Wrapper;
};

describe("useRefereeDetails hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee details when campId and refereeId are present", async () => {
    const mockDetails = { id: 7, name: "Referee John", rating: 9.2 };
    mockGetRefereeDetails.mockResolvedValueOnce({
      data: { data: mockDetails },
    });

    const { result } = renderHook(() => useGetRefereeDetails(12, 7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetRefereeDetails).toHaveBeenCalledWith(12, 7);
    expect(result.current.refereeDetails).toEqual(mockDetails);
  });

  it("does not fetch if campId or refereeId is missing", () => {
    const { result } = renderHook(() => useGetRefereeDetails(null, 7), {
      wrapper: createWrapper(),
    });

    expect(mockGetRefereeDetails).not.toHaveBeenCalled();
    expect(result.current.refereeDetails).toBeUndefined();
  });
});
