import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useExportReferees,
  useExportEvaluators,
  useExportCrews,
  useExportRanking,
  useExportSchedule,
} from "../useExport";

const mockExportReferees = vi.fn();
const mockExportEvaluators = vi.fn();
const mockExportCrews = vi.fn();
const mockExportRanking = vi.fn();
const mockExportSchedule = vi.fn();

vi.mock("@/services/director-services/export.service", () => ({
  useExportService: () => ({
    exportReferees: mockExportReferees,
    exportEvaluators: mockExportEvaluators,
    exportCrews: mockExportCrews,
    exportRanking: mockExportRanking,
    exportSchedule: mockExportSchedule,
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
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "ExportWrapper";
  return Wrapper;
};

describe("useExport hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => "blob:test");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it("exports referees, evaluators, crews, rankings, and schedules as blob", async () => {
    const mockBlobResponse = { data: new Blob(["csv content"], { type: "text/csv" }) };
    mockExportReferees.mockResolvedValueOnce(mockBlobResponse);
    mockExportEvaluators.mockResolvedValueOnce(mockBlobResponse);
    mockExportCrews.mockResolvedValueOnce(mockBlobResponse);
    mockExportRanking.mockResolvedValueOnce(mockBlobResponse);
    mockExportSchedule.mockResolvedValueOnce(mockBlobResponse);

    const { result: refHook } = renderHook(() => useExportReferees(10), { wrapper: createWrapper() });
    const { result: evalHook } = renderHook(() => useExportEvaluators(10), { wrapper: createWrapper() });
    const { result: crewHook } = renderHook(() => useExportCrews(10), { wrapper: createWrapper() });
    const { result: rankHook } = renderHook(() => useExportRanking(10), { wrapper: createWrapper() });
    const { result: schedHook } = renderHook(() => useExportSchedule(10), { wrapper: createWrapper() });

    await act(async () => {
      await refHook.current.mutateAsync();
      await evalHook.current.mutateAsync();
      await crewHook.current.mutateAsync();
      await rankHook.current.mutateAsync();
      await schedHook.current.mutateAsync();
    });

    expect(mockExportReferees).toHaveBeenCalledWith(10);
    expect(mockExportEvaluators).toHaveBeenCalledWith(10);
    expect(mockExportCrews).toHaveBeenCalledWith(10);
    expect(mockExportRanking).toHaveBeenCalledWith(10);
    expect(mockExportSchedule).toHaveBeenCalledWith(10);
  });
});
