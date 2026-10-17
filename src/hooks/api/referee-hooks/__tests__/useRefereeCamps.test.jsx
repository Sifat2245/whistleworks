import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMyCheckins,
  useMyRegistrations,
  useRefereePreviousCamps,
  useCheckIn,
  useRefereeRegister,
} from "../useRefereeCamps";

const mockGetMyCheckins = vi.fn();
const mockGetMyRegistrations = vi.fn();
const mockGetPreviousCamps = vi.fn();
const mockCheckIn = vi.fn();
const mockRegister = vi.fn();

vi.mock("@/services/referee-services/referee-camp.service", () => ({
  useRefereeCampService: () => ({
    getMyCheckins: mockGetMyCheckins,
    getMyRegistrations: mockGetMyRegistrations,
    getPreviousCamps: mockGetPreviousCamps,
    checkIn: mockCheckIn,
    register: mockRegister,
  }),
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
  Wrapper.displayName = "RefereeCampsWrapper";
  return Wrapper;
};

describe("useRefereeCamps hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches referee checkins and registrations", async () => {
    mockGetMyCheckins.mockResolvedValueOnce({
      data: { data: { checkins: [{ id: 1 }], pagination: { total: 1 } } },
    });
    mockGetMyRegistrations.mockResolvedValueOnce({
      data: { data: { registrations: [{ id: 2 }], pagination: { total: 1 } } },
    });

    const { result: checkinsHook } = renderHook(() => useMyCheckins(1, 10), {
      wrapper: createWrapper(),
    });
    const { result: regsHook } = renderHook(() => useMyRegistrations(1, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(checkinsHook.current.isLoading).toBe(false));
    await waitFor(() => expect(regsHook.current.isLoading).toBe(false));

    expect(mockGetMyCheckins).toHaveBeenCalledWith(1, 10);
    expect(mockGetMyRegistrations).toHaveBeenCalledWith(1, 10);
  });

  it("fetches referee previous camps when enabled is true", async () => {
    mockGetPreviousCamps.mockResolvedValueOnce({
      data: { data: { previous_camps: [{ id: 100 }], pagination: { total: 1 } } },
    });

    const { result } = renderHook(
      () => useRefereePreviousCamps(1, { enabled: true }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetPreviousCamps).toHaveBeenCalledWith(1);
    expect(result.current.previousCamps).toHaveLength(1);
  });

  it("does not fetch previous camps when enabled is false", () => {
    const { result } = renderHook(
      () => useRefereePreviousCamps(1, { enabled: false }),
      { wrapper: createWrapper() }
    );

    expect(mockGetPreviousCamps).not.toHaveBeenCalled();
    expect(result.current.previousCamps).toEqual([]);
  });

  it("calls checkIn and register mutations", async () => {
    mockCheckIn.mockResolvedValueOnce({ data: { message: "Checked In" } });
    mockRegister.mockResolvedValueOnce({ data: { message: "Registered" } });

    const { result: checkInHook } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    });
    const { result: registerHook } = renderHook(() => useRefereeRegister(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await checkInHook.current.mutateAsync(5);
      await registerHook.current.mutateAsync({ campId: 5, payload: {} });
    });

    expect(mockCheckIn.mock.calls[0][0]).toBe(5);
    expect(mockRegister).toHaveBeenCalledWith(5, {});
  });
});
