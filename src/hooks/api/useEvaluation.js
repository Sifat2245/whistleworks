import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvaluationService } from "@/services/evaluation.service";
import Swal from "sweetalert2";

// Query key factory
export const evaluationKeys = {
  all: ["evaluations"],
  myEvaluations: (campId, page = 1, params = {}) => [
    "my-evaluations",
    campId,
    page,
    params,
  ],
  details: (evaluationId) => ["evaluation-details", evaluationId],
  registeredReferees: (campId, page) => ["registered-referees", campId, page],
  refereeEvaluation: (campId, refereeId) => [
    "referee-evaluation",
    campId,
    refereeId,
  ],
  campEvaluations: (campId, page) => ["camp-evaluations", campId, page],
  rankings: (campId) => ["referees-ranking", campId],
  stats: (campId) => ["evaluation-stats", campId],
  recommendedLevels: (campId) => [
    "recommended-levels",
    campId ? String(campId) : "all",
  ],
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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    getRegisterReferess: data?.referees || [],
    pagination: data?.pagination || {},
    isLoading,
    isFetching,
  };
};

// Get evaluations list submitted by current user for a camp
export const useMyEvaluations = (campId, page = 1, params = {}) => {
  const { getMyCampEvaluations } = useEvaluationService();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: evaluationKeys.myEvaluations(campId, page, params),
    queryFn: async () => {
      const response = await getMyCampEvaluations(campId, page, params);
      return (
        response?.data?.data || {
          camp: null,
          evaluations: [],
          overall_level_summary: [],
          statistics: { total_evaluations: 0, unique_referees_evaluated: 0 },
          pagination: { total: 0, per_page: 15, current_page: 1, last_page: 1 },
        }
      );
    },
    enabled: !!campId,
    staleTime: 1 * 60 * 1000,
  });

  return {
    data,
    camp: data?.camp || null,
    evaluations: data?.evaluations || [],
    overall_level_summary: data?.overall_level_summary || [],
    statistics: data?.statistics || {
      total_evaluations: 0,
      unique_referees_evaluated: 0,
    },
    pagination: data?.pagination || {
      total: 0,
      per_page: 15,
      current_page: 1,
      last_page: 1,
    },
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

// Get single evaluation details by evaluation ID
export const useEvaluationDetails = (evaluationId, options = {}) => {
  const { getEvaluationDetails } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.details(evaluationId),
    queryFn: async () => {
      const response = await getEvaluationDetails(evaluationId);
      return response?.data?.data || null;
    },
    enabled: !!evaluationId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
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

// Get recommended highest levels (passing camp_id and format: objects in params)
export const useRecommendedLevels = (campId) => {
  const { getRecommendLevels } = useEvaluationService();

  return useQuery({
    queryKey: evaluationKeys.recommendedLevels(campId),
    queryFn: async () => {
      const response = await getRecommendLevels(campId);
      return response?.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
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

// Helper to invalidate all evaluation-related query keys
export const invalidateEvaluationQueries = (queryClient, campId) => {
  queryClient.invalidateQueries({ queryKey: ["my-evaluations"] });
  queryClient.invalidateQueries({ queryKey: ["camp-evaluations"] });
  queryClient.invalidateQueries({ queryKey: ["evaluation-stats"] });
  queryClient.invalidateQueries({ queryKey: ["evaluation-details"] });
  queryClient.invalidateQueries({ queryKey: ["referee-evaluation"] });
  queryClient.invalidateQueries({ queryKey: ["referees-ranking"] });
  queryClient.invalidateQueries({ queryKey: ["rankings"] });
  queryClient.invalidateQueries({ queryKey: evaluationKeys.all });

  if (campId) {
    queryClient.invalidateQueries({ queryKey: ["my-evaluations", campId] });
    queryClient.invalidateQueries({
      queryKey: ["my-evaluations", Number(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["my-evaluations", String(campId)],
    });
    queryClient.invalidateQueries({ queryKey: ["camp-evaluations", campId] });
    queryClient.invalidateQueries({
      queryKey: ["camp-evaluations", Number(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["camp-evaluations", String(campId)],
    });
    queryClient.invalidateQueries({ queryKey: ["evaluation-stats", campId] });
    queryClient.invalidateQueries({
      queryKey: ["evaluation-stats", Number(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["evaluation-stats", String(campId)],
    });
    queryClient.invalidateQueries({ queryKey: ["referees-ranking", campId] });
    queryClient.invalidateQueries({
      queryKey: ["referees-ranking", Number(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["referees-ranking", String(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["rankings", "evaluations", campId],
    });
    queryClient.invalidateQueries({
      queryKey: ["rankings", "evaluations", Number(campId)],
    });
    queryClient.invalidateQueries({
      queryKey: ["rankings", "evaluations", String(campId)],
    });
  }
};

// Store (submit new) evaluation
export const useStoreEvaluation = (campId, options = {}) => {
  const { storeEvaluation } = useEvaluationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["store-evaluation", campId],
    mutationFn: (formData) => storeEvaluation(formData),
    onSuccess: (response, variables, context) => {
      invalidateEvaluationQueries(queryClient, campId);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response?.data?.message || "Evaluation submitted successfully",
        timer: 2500,
        showConfirmButton: false,
      });

      options?.onSuccess?.(response, variables, context);
    },
    onError: (error, variables, context) => {
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

      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Alias for submitEvaluation for backward compatibility
export const useSubmitEvaluation = useStoreEvaluation;

// Update existing evaluation
export const useUpdateEvaluation = (campId, options = {}) => {
  const { updateEvaluation } = useEvaluationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-evaluation", campId],
    mutationFn: ({ evaluationId, formData }) =>
      updateEvaluation(evaluationId, formData),
    onSuccess: (response, variables, context) => {
      const targetCampId =
        campId ||
        variables?.campId ||
        variables?.camp_id ||
        variables?.formData?.get?.("camp_id");
      invalidateEvaluationQueries(queryClient, targetCampId);
      if (variables?.evaluationId) {
        queryClient.invalidateQueries({
          queryKey: evaluationKeys.details(variables.evaluationId),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: response?.data?.message || "Evaluation updated successfully",
        timer: 2500,
        showConfirmButton: false,
      });

      options?.onSuccess?.(response, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data ||
        "Failed to update evaluation.";

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: typeof errorMessage === "string" ? errorMessage : "Something went wrong!",
        timer: 4000,
        showConfirmButton: false,
      });

      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Delete an evaluation
export const useDeleteEvaluation = (campId, options = {}) => {
  const { deleteEvaluation } = useEvaluationService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-evaluation", campId],
    mutationFn: (evaluationId) => deleteEvaluation(evaluationId),
    onSuccess: (response, variables, context) => {
      invalidateEvaluationQueries(queryClient, campId);
      if (variables) {
        queryClient.removeQueries({
          queryKey: evaluationKeys.details(variables),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: response?.data?.message || "Evaluation deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      options?.onSuccess?.(response, variables, context);
    },
    onError: (error, variables, context) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete evaluation",
        timer: 3000,
        showConfirmButton: false,
      });

      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Helper to build FormData for evaluation store or update
export const buildEvaluationFormData = (data, campId) => {
  const formData = new FormData();

  if (data?.referee_id) {
    formData.append("referee_id", data.referee_id);
  }
  if (campId) {
    formData.append("camp_id", campId);
  }

  if (data?.call_accuracy !== undefined && data?.call_accuracy !== null && data?.call_accuracy !== "") {
    formData.append("call_accuracy", Number(data.call_accuracy));
  }
  if (data?.communication_skills !== undefined && data?.communication_skills !== null && data?.communication_skills !== "") {
    formData.append("communication_skills", Number(data.communication_skills));
  }
  if (data?.consistency_of_calls !== undefined && data?.consistency_of_calls !== null && data?.consistency_of_calls !== "") {
    formData.append("consistency_of_calls", Number(data.consistency_of_calls));
  }
  if (data?.court_position_mechanics !== undefined && data?.court_position_mechanics !== null && data?.court_position_mechanics !== "") {
    formData.append("court_position_mechanics", Number(data.court_position_mechanics));
  }
  if (data?.fitness_mobility !== undefined && data?.fitness_mobility !== null && data?.fitness_mobility !== "") {
    formData.append("fitness_mobility", Number(data.fitness_mobility));
  }
  if (data?.game_awareness !== undefined && data?.game_awareness !== null && data?.game_awareness !== "") {
    formData.append("game_awareness", Number(data.game_awareness));
  }

  const recLevel = data?.recommended_level ?? data?.recommended_level_id;
  if (recLevel !== undefined && recLevel !== null && recLevel !== "") {
    let resolvedLevel = recLevel;
    if (typeof recLevel === "object" && recLevel !== null) {
      resolvedLevel =
        recLevel.id !== undefined && recLevel.id !== null && recLevel.id !== ""
          ? recLevel.id
          : (recLevel.name || recLevel.level);
    }
    formData.append("recommended_level", resolvedLevel);
  }

  formData.append("status", data?.status || "submitted");

  if (data?.private_comments?.trim?.()) {
    formData.append("private_comments", data.private_comments.trim());
  }

  if (data?.referee_feedback?.trim?.()) {
    formData.append("referee_feedback", data.referee_feedback.trim());
  }

  return formData;
};
