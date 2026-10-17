import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import {
  useGetDateRange,
  usePublishSchedule,
  useClearSchedule,
  useDeleteSchedule,
  useCreateSchedule,
} from "../useBuildSchedule";

const mockGetDateRange = vi.fn();
const mockPublishSchedule = vi.fn();
const mockClearSchedule = vi.fn();
const mockDeleteSchedule = vi.fn();
const mockCreateSchedule = vi.fn();

vi.mock("@/services/director-services/buildSchedule.service", () => ({
  useBuildScheduleService: () => ({
    getDateRange: mockGetDateRange,
    publishSchedule: mockPublishSchedule,
    clearSchedule: mockClearSchedule,
    deleteSchedule: mockDeleteSchedule,
    createSchedule: mockCreateSchedule,
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
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
  Wrapper.displayName = "BuildScheduleWrapper";
  return Wrapper;
};

describe("useBuildSchedule hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches date range for a camp", async () => {
    mockGetDateRange.mockResolvedValueOnce({
      data: { data: ["2026-06-01", "2026-06-02"] },
    });

    const { result } = renderHook(() => useGetDateRange(12), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetDateRange).toHaveBeenCalledWith(12);
    expect(result.current.data).toEqual(["2026-06-01", "2026-06-02"]);
  });

  it("publishes, clears, and deletes schedule", async () => {
    mockPublishSchedule.mockResolvedValueOnce({ data: { message: "Published" } });
    mockClearSchedule.mockResolvedValueOnce({ data: { message: "Cleared" } });
    mockDeleteSchedule.mockResolvedValueOnce({ data: { message: "Deleted" } });

    const { result: pubHook } = renderHook(() => usePublishSchedule(12), {
      wrapper: createWrapper(),
    });
    const { result: clearHook } = renderHook(() => useClearSchedule(), {
      wrapper: createWrapper(),
    });
    const { result: delHook } = renderHook(() => useDeleteSchedule(12), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await pubHook.current.mutateAsync();
      await clearHook.current.mutateAsync(101);
      await delHook.current.mutateAsync();
    });

    expect(mockPublishSchedule).toHaveBeenCalledWith(12);
    expect(mockClearSchedule).toHaveBeenCalledWith(101);
    expect(mockDeleteSchedule).toHaveBeenCalledWith(12);
  });

  it("creates schedule for a camp", async () => {
    mockCreateSchedule.mockResolvedValueOnce({
      data: { message: "Schedule created." },
    });

    const { result } = renderHook(() => useCreateSchedule(12), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ court_count: 3 });
    });

    expect(mockCreateSchedule).toHaveBeenCalledWith(12, { court_count: 3 });
  });
});
