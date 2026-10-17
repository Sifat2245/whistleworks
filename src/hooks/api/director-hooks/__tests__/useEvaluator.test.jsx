import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePendingEvaluators,
  useApprovedEvaluators,
  useRejectedEvaluators,
  useApproveEvaluator,
  useRejectEvaluator,
  useRemoveEvaluator,
} from "../useEvaluator";

const mockGetPendingEvaluators = vi.fn();
const mockGetApprovedEvaluators = vi.fn();
const mockGetAllRejectedEvaluators = vi.fn();
const mockApproveEvaluator = vi.fn();
const mockRejectEvaluator = vi.fn();
const mockRemoveEvaluator = vi.fn();

vi.mock("@/services/director-services/evaluator.service", () => ({
  useEvaluatorService: () => ({
    getPendingEvaluators: mockGetPendingEvaluators,
    getApprovedEvaluators: mockGetApprovedEvaluators,
    getAllRejectedEvaluators: mockGetAllRejectedEvaluators,
    approveEvaluator: mockApproveEvaluator,
    rejectEvaluator: mockRejectEvaluator,
    removeEvaluator: mockRemoveEvaluator,
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
  Wrapper.displayName = "EvaluatorWrapper";
  return Wrapper;
};

describe("useEvaluator hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pending, approved, and rejected evaluators", async () => {
    mockGetPendingEvaluators.mockResolvedValueOnce({
      data: { data: { registrations: [{ id: 1, evaluator: { name: "Eval 1" } }], pagination: { total: 1 } } },
    });
    mockGetApprovedEvaluators.mockResolvedValueOnce({
      data: { data: { registrations: [{ id: 2, evaluator: { name: "Eval 2" } }], pagination: { total: 1 } } },
    });
    mockGetAllRejectedEvaluators.mockResolvedValueOnce({
      data: { data: { registrations: [{ id: 3, evaluator: { name: "Eval 3" } }], pagination: { total: 1 } } },
    });

    const { result: pendingHook } = renderHook(() => usePendingEvaluators(10, 1), {
      wrapper: createWrapper(),
    });
    const { result: approvedHook } = renderHook(() => useApprovedEvaluators(10, 1, ""), {
      wrapper: createWrapper(),
    });
    const { result: rejectedHook } = renderHook(() => useRejectedEvaluators(10, 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(pendingHook.current.isLoading).toBe(false));
    await waitFor(() => expect(approvedHook.current.isLoading).toBe(false));
    await waitFor(() => expect(rejectedHook.current.isLoading).toBe(false));

    expect(pendingHook.current.pendingEvaluators).toHaveLength(1);
    expect(approvedHook.current.approvedEvaluators).toHaveLength(1);
    expect(rejectedHook.current.rejectedEvaluators).toHaveLength(1);
  });

  it("calls approve, reject, and remove evaluator mutations", async () => {
    mockApproveEvaluator.mockResolvedValueOnce({ data: { message: "Approved" } });
    mockRejectEvaluator.mockResolvedValueOnce({ data: { message: "Rejected" } });
    mockRemoveEvaluator.mockResolvedValueOnce({ data: { message: "Removed" } });

    const { result: approveHook } = renderHook(() => useApproveEvaluator(10), {
      wrapper: createWrapper(),
    });
    const { result: rejectHook } = renderHook(() => useRejectEvaluator(10), {
      wrapper: createWrapper(),
    });
    const { result: removeHook } = renderHook(() => useRemoveEvaluator(10), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await approveHook.current.mutateAsync(1);
      await rejectHook.current.mutateAsync(2);
      await removeHook.current.mutateAsync(3);
    });

    expect(mockApproveEvaluator.mock.calls[0][0]).toBe(1);
    expect(mockRejectEvaluator.mock.calls[0][0]).toBe(2);
    expect(mockRemoveEvaluator.mock.calls[0][0]).toBe(3);
  });
});
