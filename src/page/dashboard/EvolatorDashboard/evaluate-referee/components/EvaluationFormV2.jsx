import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import { useRecommendedLevels } from "@/hooks/api/useEvaluation";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
})).sort((a, b) => a.value - b.value);

const EvaluationFormV2 = ({ camp_id, sports_type_name }) => {
  const axiosInstance = useAxiosSecure();
  const { getRegisterReferess } = useRegisteredReferees(camp_id);

  // Recommended highest levels are driven by the camp's sports type
  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(sports_type_name);

  const levelOptions = recommendedLevels.map((level) => ({
    label: level,
    value: level,
  }));

  // Convert referees to select options
  const convertedRefOptions = getRegisterReferess?.map((ref) => ({
    value: String(ref?.referee_id),
    label: (
      <div className="w-full flex items-center gap-2">
        <Avatar src={ref?.avatar} size={32} />
        <span>{ref?.name}</span> {ref?.jersey_number ? `#${ref?.jersey_number}` : ""}
      </div>
    ),
  }));

  // React Hook Form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  // Mutation for submitting evaluation
  const giveEvaluationMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/referee/evaluation/upsert",
        formData
      );
      return response?.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data?.message || "Evaluation submitted successfully",
        timer: 2500,
        showConfirmButton: false,
      });

      // Reset the entire form after success
      resetForm();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data ||
        "Something went wrong! Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        timer: 4000,
        showConfirmButton: false,
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("referee_id", data.referee_id);
    formData.append("camp_id", camp_id);

    formData.append("call_accuracy", Number(data.call_accuracy));
    formData.append("communication_skills", Number(data.communication_skills));
    formData.append("consistency_of_calls", Number(data.consistency_of_calls));
    formData.append("court_position_mechanics", Number(data.court_position_mechanics));
    formData.append("fitness_mobility", Number(data.fitness_mobility));
    formData.append("game_awareness", Number(data.game_awareness));

    if (data.private_comments?.trim()) {
      formData.append("private_comments", data.private_comments);
    }

    if (data.referee_feedback?.trim()) {
      formData.append("referee_feedback", data.referee_feedback);
    }

    formData.append("recommended_level", data.recommended_level);
    formData.append("status", "submitted");

    giveEvaluationMutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-6 rounded-xl border border-black/10 shadow-sm flex flex-col gap-6"
    >
      <h2 className="text-2xl text-black font-bold">Evaluation Form</h2>

      <div>
        <h3 className="font-medium text-lg text-black">Performance Criteria</h3>
        <p className="text-sm text-gray-600 mt-1">Who are you evaluating?</p>
      </div>

      {/* Select Referee */}
      <CommonInputWrapper
        type="select"
        selectClass="text-center!"
        label="Select A Referee"
        placeholder="+ Select A Referee"
        register_as="referee_id"
        control={control}
        options={convertedRefOptions}
        validationRules={{ required: "Please select a referee" }}
        errors={errors}
      />

      {/* Call Accuracy */}
      <CommonInputWrapper
        type="select"
        label="Call/No Call Accuracy (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="call_accuracy"
        control={control}
        options={scoreOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Communication Skills */}
      <CommonInputWrapper
        type="select"
        label="Communication Skills (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="communication_skills"
        control={control}
        options={scoreOptions}
        
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Consistency of Calls */}
      <CommonInputWrapper
        type="select"
        label="Consistency of Calls (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="consistency_of_calls"
        control={control}
        options={scoreOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Court Position / Mechanics */}
      <CommonInputWrapper
        type="select"
        label="Court Position/Mechanics (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="court_position_mechanics"
        control={control}
        options={scoreOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Fitness / Mobility */}
      <CommonInputWrapper
        type="select"
        label="Fitness/Mobility (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="fitness_mobility"
        control={control}
        options={scoreOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Game Awareness */}
      <CommonInputWrapper
        type="select"
        label="Game Awareness (10=Excellent; 1=Poor)"
        placeholder="Select one.."
        register_as="game_awareness"
        control={control}
        options={scoreOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Private Comments */}
      <CommonInputWrapper
        type="textarea"
        label="Private Comments"
        textareaClass="border-black/15"
        placeholder="Write private comments (visible only to evaluators and directors)..."
        register_as="private_comments"
        register={register}
        errors={errors}
      />

      {/* Referee Feedback */}
      <CommonInputWrapper
        type="textarea"
        textareaClass="border-black/15"
        label="Referee Feedback"
        placeholder="Write feedback for the referee..."
        register_as="referee_feedback"
        register={register}
        errors={errors}
      />

      {/* Recommended Level */}
      <CommonInputWrapper
        type="select"
        label="Recommended HIGHEST Level of Officiating"
        placeholder={levelsLoading ? "Loading levels..." : "Select one.."}
        register_as="recommended_level"
        control={control}
        options={levelOptions}
        disabled={levelsLoading}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      {/* Submit Button */}
      <CommonSubmitBtn
        variant="primary"
        className="mt-4"
        disabled={giveEvaluationMutation.isPending}
      >
        {giveEvaluationMutation.isPending ? (
          <LoaderV2 />
        ) : (
          "Submit Evaluation"
        )}
      </CommonSubmitBtn>
    </form>
  );
};

export default EvaluationFormV2;