import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import useRegisteredReferees from "@/hooks/get-registered-referees";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

const EvaluationForm = ({ camp_id }) => {
  const axiosInstace = useAxiosSecure();
  const { getRegisterReferess } = useRegisteredReferees(camp_id);

  // Note: convert referee name and id to label and value
  const covertedRefOptions = getRegisterReferess?.map(ref => ({
    value: String(ref?.referee_id),
    label: (
      <div className="w-full flex items-center gap-2">
        <Avatar src={ref.avatar} size={32} />
        <span>{ref.name}</span>
      </div>
    )
  }));

  // Note: react hook form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Note: Evaluation handler mutation
  const giveEvaluationMutation = useMutation({
    mutationKey: ["give-evaluation"],
    mutationFn: async (formData) => {
      const response = await axiosInstace.post(
        "/referee/evaluation/store",
        formData
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Evaluation created successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  // Note: evaluation submit
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
    giveEvaluationMutation.mutate(formData);
  };

  // Note: main ui component
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-6 rounded-xl border border-black/10 shadow-sm flex flex-col gap-6"
    >
      <h2 className="text-2xl  text-black">Evaluation Form</h2>

      <div>
        <h3 className="font-medium text-lg text-black">Performance Criteria</h3>
        <p className="text-sm text-gray-600 mt-1">Who are you evaluating?</p>
      </div>

      {/* Select Referee */}
      <CommonInputWrapper
        type="select"
        selectClass={"text-center!"}
        label="Select A Referee"
        placeholder="+ Select A Referee"
        register_as="referee_id"
        control={control}
        options={covertedRefOptions}
        validationRules={{ required: "Please select a referee" }}
        errors={errors}
      />

      {/* 1. Call / No Call Accuracy */}
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

      {/* 2. Communication Skills */}
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

      {/* 3. Consistency of Calls */}
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

      {/* 4. Court Position / Mechanics */}
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

      {/* 5. Fitness / Mobility */}
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

      {/* 6. Game Awareness */}
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
        label="Private Comments :"
        textareaClass={'border-black/15'}
        placeholder="Write comments..."
        register_as="private_comments"
        register={register}
        errors={errors}
      />

      {/* Referee Feedback */}
      <CommonInputWrapper
        type="textarea"
        textareaClass={'border-black/15'}
        label="Referee Feedback :"
        placeholder="Write feedback..."
        register_as="referee_feedback"
        register={register}
        errors={errors}
      />

      {/* Highest Level Recommendation */}
      <CommonInputWrapper
        type="select"
        label="Recommended HIGHEST Level of Officiating"
        placeholder="Select one.."
        register_as="recommended_highest_level"
        control={control}
        options={[
          { label: "NCAA D1", value: "NCAA_D1" },
          { label: "NCAA D2", value: "NCAA_D2" },
          { label: "NAIA", value: "NAIA" },
          { label: "JUCO", value: "JUCO" },
          { label: "HS", value: "HS" },
          { label: "JH/ELEM", value: "JH/ELEM" },
        ]}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      <CommonSubmitBtn variant="primary" className="mt-2" disabled={giveEvaluationMutation.isPending}>
        {giveEvaluationMutation.isPending ? <LoaderV2 /> : "Submit Evaluation"}
      </CommonSubmitBtn>
    </form>
  );
};
export default EvaluationForm;