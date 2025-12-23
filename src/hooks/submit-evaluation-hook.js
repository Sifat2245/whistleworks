import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const useSubmitEvaluation = ({ camp_id }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["give-evaluation", camp_id],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/referee/evaluation/store",
        formData
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Evaluation created successfully");
      queryClient.invalidateQueries({
        queryKey: ["referees-ranking", camp_id],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  const submitEvaluation = (data) => {
    const formData = new FormData();

    formData.append("referee_id", data.referee_id);
    formData.append("camp_id", camp_id);

    formData.append("call_accuracy", Number(data.call_accuracy));
    formData.append("communication_skills", Number(data.communication_skills));
    formData.append("consistency_of_calls", Number(data.consistency_of_calls));
    formData.append(
      "court_position_mechanics",
      Number(data.court_position_mechanics)
    );
    formData.append("fitness_mobility", Number(data.fitness_mobility));
    formData.append("game_awareness", Number(data.game_awareness));

    if (data.private_comments) {
      formData.append("private_comments", data.private_comments);
    }

    if (data.referee_feedback) {
      formData.append("referee_feedback", data.referee_feedback);
    }

    formData.append(
      "recommended_highest_level",
      data.recommended_highest_level
    );
    formData.append("status", "submitted");

    mutation.mutate(formData);
  };

  return {
    submitEvaluation,
    isSubmitting: mutation.isPending,
  };
};

export default useSubmitEvaluation;
