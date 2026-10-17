import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCampSchedule from "../useCampSchedule";

const mockGet = vi.fn();
vi.mock("../useAxiosSecure", () => ({
  default: () => ({
    get: mockGet,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryClientWrapper";
  return Wrapper;
};

describe("useCampSchedule hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp schedule when campId is provided", async () => {
    const mockSchedule = {
      status: "published",
      courts: [{ id: 1, name: "Court 1" }],
    };
    mockGet.mockResolvedValueOnce({ data: { data: mockSchedule } });

    const { result } = renderHook(() => useCampSchedule(42), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGet).toHaveBeenCalledWith("/v1/camp/42/schedule");
    expect(result.current.scheduleData).toEqual(mockSchedule);
    expect(result.current.isError).toBe(false);
  });

  it("does not fetch schedule when campId is missing", () => {
    const { result } = renderHook(() => useCampSchedule(null), {
      wrapper: createWrapper(),
    });

    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.scheduleData).toBeUndefined();
  });
});
