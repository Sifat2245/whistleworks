import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  evaluationKeys,
  useRecommendedLevels,
  useMyEvaluations,
  useEvaluationDetails,
  useStoreEvaluation,
  useDeleteEvaluation,
  buildEvaluationFormData,
} from "../useEvaluation";

const mockGetRecommendLevels = vi.fn();
const mockGetMyCampEvaluations = vi.fn();
const mockGetEvaluationDetails = vi.fn();
const mockStoreEvaluation = vi.fn();
const mockDeleteEvaluation = vi.fn();

vi.mock("@/services/evaluation.service", () => ({
  useEvaluationService: () => ({
    getRecommendLevels: (...args) => mockGetRecommendLevels(...args),
    getMyCampEvaluations: (...args) => mockGetMyCampEvaluations(...args),
    getEvaluationDetails: (...args) => mockGetEvaluationDetails(...args),
    storeEvaluation: (...args) => mockStoreEvaluation(...args),
    submitEvaluation: (...args) => mockStoreEvaluation(...args),
    deleteEvaluation: (...args) => mockDeleteEvaluation(...args),
  }),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("useEvaluation hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("evaluationKeys factory", () => {
    it("generates correct query keys", () => {
      expect(evaluationKeys.all).toEqual(["evaluations"]);
      expect(evaluationKeys.recommendedLevels(16)).toEqual([
        "recommended-levels",
        "16",
      ]);
      expect(evaluationKeys.recommendedLevels()).toEqual([
        "recommended-levels",
        "all",
      ]);
      expect(evaluationKeys.myEvaluations(13, 1)).toEqual([
        "my-evaluations",
        13,
        1,
        {},
      ]);
      expect(evaluationKeys.details(16)).toEqual(["evaluation-details", 16]);
    });
  });

  describe("useRecommendedLevels", () => {
    it("fetches recommended levels passing campId and format objects", async () => {
      mockGetRecommendLevels.mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            { id: 7, name: "Large School Varsity", level: "Large School Varsity" },
            { id: 8, name: "Mid Size School Varsity", level: "Mid Size School Varsity" },
          ],
        },
      });

      const { result } = renderHook(() => useRecommendedLevels(16), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetRecommendLevels).toHaveBeenCalledWith(16);
      expect(result.current.data).toEqual([
        { id: 7, name: "Large School Varsity", level: "Large School Varsity" },
        { id: 8, name: "Mid Size School Varsity", level: "Mid Size School Varsity" },
      ]);
    });
  });

  describe("useMyEvaluations", () => {
    it("fetches evaluations for a camp", async () => {
      const mockPayload = {
        camp: { id: 13, name: "Training Camp 2" },
        evaluations: [
          {
            id: 16,
            referee: { id: 76, name: "Referee1 User" },
            total_score: 59,
            current_recommended_level: "Small School Varsity",
          },
        ],
        statistics: { total_evaluations: 1, unique_referees_evaluated: 1 },
        pagination: { total: 1, per_page: 15, current_page: 1, last_page: 1 },
      };

      mockGetMyCampEvaluations.mockResolvedValueOnce({
        data: {
          success: true,
          data: mockPayload,
        },
      });

      const { result } = renderHook(() => useMyEvaluations(13, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.evaluations).toHaveLength(1);
      expect(result.current.evaluations[0].id).toBe(16);
      expect(result.current.statistics.total_evaluations).toBe(1);
      expect(mockGetMyCampEvaluations).toHaveBeenCalledWith(13, 1, {});
    });
  });

  describe("useEvaluationDetails", () => {
    it("fetches evaluation details by id", async () => {
      mockGetEvaluationDetails.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 16,
            referee: { id: 76, name: "Referee1 User" },
            performance_criteria: { call_accuracy: 9 },
          },
        },
      });

      const { result } = renderHook(() => useEvaluationDetails(16), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data.id).toBe(16);
      expect(mockGetEvaluationDetails).toHaveBeenCalledWith(16);
    });
  });

  describe("buildEvaluationFormData", () => {
    it("creates FormData with expected evaluation fields and handles level id", () => {
      const formData = buildEvaluationFormData(
        {
          referee_id: "76",
          call_accuracy: 9,
          communication_skills: 10,
          recommended_level: 7,
          private_comments: "Private note",
          referee_feedback: "Good mechanics",
        },
        13
      );

      expect(formData.get("referee_id")).toBe("76");
      expect(formData.get("camp_id")).toBe("13");
      expect(formData.get("call_accuracy")).toBe("9");
      expect(formData.get("communication_skills")).toBe("10");
      expect(formData.get("recommended_level")).toBe("7");
      expect(formData.get("private_comments")).toBe("Private note");
      expect(formData.get("referee_feedback")).toBe("Good mechanics");
      expect(formData.get("status")).toBe("submitted");
    });

    it("extracts id from recommended_level object with fallback to name", () => {
      const fdWithId = buildEvaluationFormData({
        recommended_level: { id: 9, name: "Small School Varsity" },
      });
      expect(fdWithId.get("recommended_level")).toBe("9");

      const fdWithName = buildEvaluationFormData({
        recommended_level: { name: "Small School Varsity" },
      });
      expect(fdWithName.get("recommended_level")).toBe("Small School Varsity");
    });
  });

  describe("useStoreEvaluation", () => {
    it("submits evaluation formData successfully", async () => {
      mockStoreEvaluation.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Evaluation submitted successfully",
        },
      });

      const { result } = renderHook(() => useStoreEvaluation(13), {
        wrapper: createWrapper(),
      });

      const fakeFormData = new FormData();
      result.current.mutate(fakeFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockStoreEvaluation).toHaveBeenCalledWith(fakeFormData);
    });
  });

  describe("useDeleteEvaluation", () => {
    it("deletes evaluation by id successfully", async () => {
      mockDeleteEvaluation.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Evaluation deleted successfully",
        },
      });

      const { result } = renderHook(() => useDeleteEvaluation(13), {
        wrapper: createWrapper(),
      });

      result.current.mutate(16);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDeleteEvaluation).toHaveBeenCalledWith(16);
    });
  });
});

