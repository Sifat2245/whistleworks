import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMyRegistrations,
  useRegisterForCamp,
  useCancelRegistration,
  useEvaluatorPreviousCamps,
} from "../useEvaluatorCamps";

const mockGetMyRegistrations = vi.fn();
const mockRegisterForCamp = vi.fn();
const mockCancelRegistration = vi.fn();
const mockGetPreviousCamps = vi.fn();

vi.mock("@/services/evaluator-services/evaluatorCampRegistration.service", () => ({
  useEvaluatorCampRegistrationService: () => ({
    getMyRegistrations: mockGetMyRegistrations,
    registerForCamp: mockRegisterForCamp,
    cancelRegistration: mockCancelRegistration,
    getPreviousCamps: mockGetPreviousCamps,
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
  Wrapper.displayName = "EvaluatorCampsWrapper";
  return Wrapper;
};

describe("useEvaluatorCamps hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches evaluator registrations", async () => {
    mockGetMyRegistrations.mockResolvedValueOnce({
      data: {
        data: {
          registrations: [{ id: 1, camp_id: 10 }],
          pagination: { total: 1 },
        },
      },
    });

    const { result } = renderHook(() => useMyRegistrations(1, 12), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetMyRegistrations).toHaveBeenCalledWith(1, 12);
    expect(result.current.registrations).toEqual([{ id: 1, camp_id: 10 }]);
  });

  it("mutates camp registration and cancellation", async () => {
    mockRegisterForCamp.mockResolvedValueOnce({
      data: { message: "Registered" },
    });
    mockCancelRegistration.mockResolvedValueOnce({
      data: { message: "Cancelled" },
    });

    const { result: registerHook } = renderHook(() => useRegisterForCamp(), {
      wrapper: createWrapper(),
    });
    const { result: cancelHook } = renderHook(() => useCancelRegistration(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await registerHook.current.mutateAsync({ camp_id: 10 });
      await cancelHook.current.mutateAsync(1);
    });

    expect(mockRegisterForCamp.mock.calls[0][0]).toEqual({ camp_id: 10 });
    expect(mockCancelRegistration.mock.calls[0][0]).toBe(1);
  });

  it("fetches evaluator previous camps with enabled option", async () => {
    mockGetPreviousCamps.mockResolvedValueOnce({
      data: {
        data: {
          registrations: [{ id: 99, camp: { name: "Old Camp" } }],
          pagination: { total: 1 },
        },
      },
    });

    const { result } = renderHook(
      () => useEvaluatorPreviousCamps(1, { enabled: true }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetPreviousCamps).toHaveBeenCalledWith(1);
    expect(result.current.registrations).toHaveLength(1);
  });

  it("does not fetch previous camps when enabled is false", () => {
    const { result } = renderHook(
      () => useEvaluatorPreviousCamps(1, { enabled: false }),
      { wrapper: createWrapper() }
    );

    expect(mockGetPreviousCamps).not.toHaveBeenCalled();
    expect(result.current.registrations).toEqual([]);
  });
});
