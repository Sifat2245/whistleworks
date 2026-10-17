import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegisteredReferees } from "../useRegisteredReferees";

const mockGetRegisteredReferees = vi.fn();

vi.mock("@/services/registered-referees.service", () => ({
  useRegisteredRefereesService: () => ({
    getRegisteredReferees: mockGetRegisteredReferees,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "RegisteredRefereesWrapper";
  return Wrapper;
};

describe("useRegisteredReferees hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registered referees for a camp", async () => {
    const mockReferees = [
      { id: 101, name: "Referee Alpha", email: "alpha@ref.com" },
    ];
    mockGetRegisteredReferees.mockResolvedValueOnce({
      data: {
        data: {
          referees: mockReferees,
          pagination: { total: 1, current_page: 1 },
        },
      },
    });

    const { result } = renderHook(() => useRegisteredReferees(15, 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetRegisteredReferees).toHaveBeenCalledWith(15, 1);
    expect(result.current.getRegisterReferess).toEqual(mockReferees);
    expect(result.current.pagination.total).toBe(1);
  });

  it("does not fetch if campId is missing", () => {
    const { result } = renderHook(() => useRegisteredReferees(null), {
      wrapper: createWrapper(),
    });

    expect(mockGetRegisteredReferees).not.toHaveBeenCalled();
    expect(result.current.getRegisterReferess).toEqual([]);
  });
});
