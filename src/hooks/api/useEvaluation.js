import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvaluationService } from "@/services/evaluation.service";
import Swal from "sweetalert2";

// Query key factory
export const evaluationKeys = {
  all: ["evaluations"],
  registeredReferees: (campId, page) => ["registered-referees", campId, page],
  refereeEvaluation: (campId, refereeId) => [
    "referee-evaluation",
    campId,
    refereeId,
  ],
  campEvaluations: (campId, page) => ["camp-evaluations", campId, page],
  rankings: (campId) => ["referees-ranking", campId],
  stats: (campId) => ["evaluation-stats", campId],
  recommendedLevels: (sportsTypeName) => ["recommended-levels", sportsTypeName],
};

// Get registered referees (with pagination & caching)
export const useRegisteredReferees = (campId, page = 1) => {
  const { getRegisteredReferees } = useEvaluationService();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: evaluationKeys.registeredReferees(campId, page),
    queryFn: async () => {
      const response = await getRegisteredReferees(campId, page);
      return response?.data?.data || { referees: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000, // 5 min — referees list doesn't change often
    gcTime: 30 * 60 * 1000,   // keep in cache for 30 min
    placeholderData: (previousData) => previousData,
  });

  return {
    getRegisterReferess: data?.referees || [],
    pagination: data?.pagination || {},
    isLoading,
    isFetching,
  };
};

// Get a single referee's evaluation history
export const useRefereeEvaluation = (campId, refereeId) => {
  const { getRefereeEvaluation } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.refereeEvaluation(campId, refereeId),
    queryFn: async () => {
      const response = await getRefereeEvaluation(campId, refereeId);
      return response?.data?.data || null;
    },
    enabled: !!campId && !!refereeId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get all evaluations for a camp (paginated, director view)
export const useCampEvaluations = (campId, page = 1, params = {}) => {
  const { getCampEvaluations } = useEvaluationService();

  const { data, isLoading } = useQuery({
    queryKey: evaluationKeys.campEvaluations(campId, page),
    queryFn: async () => {
      const response = await getCampEvaluations(campId, page, params);
      return response?.data?.data || { evaluations: [], pagination: {} };
    },
    enabled: !!campId,
    staleTime: 3 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    evaluations: data?.evaluations || [],
    pagination: data?.pagination || {},
    isLoading,
  };
};

// Get referee rankings for a camp
export const useRefereeRankings = (campId) => {
  const { getRefereeRankings } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.rankings(campId),
    queryFn: async () => {
      const response = await getRefereeRankings(campId);
      return response?.data?.data || [];
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get recommended highest levels for a sports type (e.g. "HS Basketball").
// Always enabled — when no name is passed the API returns the generic
// level list, so the dropdown never ends up empty.
export const useRecommendedLevels = (sportsTypeName) => {
  const { getRecommendLevels } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.recommendedLevels(sportsTypeName || "default"),
    queryFn: async () => {
      const response = await getRecommendLevels(sportsTypeName);
      return response?.data?.data || [];
    },
    staleTime: 24 * 60 * 60 * 1000, // levels rarely change
    gcTime: 24 * 60 * 60 * 1000,
  });
};

// Get evaluation stats / overview
export const useEvaluationStats = (campId) => {
  const { getEvaluationStats } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.stats(campId),
    queryFn: async () => {
      const response = await getEvaluationStats(campId);
      return response?.data?.data || {};
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

//  Submit (upsert) evaluation
export const useSubmitEvaluation = (campId, options) => {
  const { submitEvaluation } = useEvaluationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["give-evaluation", campId],
    mutationFn: submitEvaluation,
    onSuccess: (response) => {
      // Invalidate related queries so data stays fresh
      queryClient.invalidateQueries({
        queryKey: evaluationKeys.rankings(campId),
      });
      queryClient.invalidateQueries({
        queryKey: evaluationKeys.campEvaluations(campId),
      });
      queryClient.invalidateQueries({
        queryKey: evaluationKeys.stats(campId),
      });

      // Show success toast
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response?.data?.message || "Evaluation submitted successfully",
        timer: 2500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data ||
        "Something went wrong! Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: typeof errorMessage === "string" ? errorMessage : "Something went wrong!",
        timer: 4000,
        showConfirmButton: false,
      });
    },
    ...options,
  });
};

// Delete an evaluation
export const useDeleteEvaluation = (campId, options) => {
  const { deleteEvaluation } = useEvaluationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-evaluation"],
    mutationFn: deleteEvaluation,
    onSuccess: () => {
      // Invalidate all evaluation-related queries for this camp
      queryClient.invalidateQueries({
        queryKey: evaluationKeys.all,
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Evaluation deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete evaluation",
        timer: 3000,
        showConfirmButton: false,
      });
    },
    ...options,
  });
};

// Helper to build the FormData for submission
export const buildEvaluationFormData = (data, campId) => {
  const formData = new FormData();

  formData.append("referee_id", data.referee_id);
  formData.append("camp_id", campId);
  formData.append("call_accuracy", Number(data.call_accuracy));
  formData.append("communication_skills", Number(data.communication_skills));
  formData.append("consistency_of_calls", Number(data.consistency_of_calls));
  formData.append(
    "court_position_mechanics",
    Number(data.court_position_mechanics),
  );
  formData.append("fitness_mobility", Number(data.fitness_mobility));
  formData.append("game_awareness", Number(data.game_awareness));
  formData.append("recommended_level", data.recommended_level);
  formData.append("status", "submitted");

  if (data.private_comments?.trim()) {
    formData.append("private_comments", data.private_comments);
  }

  if (data.referee_feedback?.trim()) {
    formData.append("referee_feedback", data.referee_feedback);
  }

  return formData;
};
