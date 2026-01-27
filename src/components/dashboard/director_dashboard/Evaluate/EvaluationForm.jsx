import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import useRegisteredReferees from "@/hooks/get-registered-referees";
import useSubmitEvaluation from "@/hooks/submit-evaluation-hook";
import { Avatar } from "antd";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

const levelOptions = [
  { label: "NCAA D1", value: "NCAA D1" },
  { label: "NCAA D2", value: "NCAA D2" },
  { label: "NAIA", value: "NAIA" },
  { label: "JUCO", value: "JUCO" },
  { label: "HS", value: "HS" },
  { label: "JH/ELEM", value: "JH/ELEM" },
];

const EvaluationForm = ({ camp_id }) => {
  const { getRegisterReferess } = useRegisteredReferees(camp_id);
  const {
    submitEvaluation,
    isSubmitting,
    isSuccess,
    isError,
    error,
    reset,
  } = useSubmitEvaluation({ camp_id });

  // Convert referee options
  const convertedRefOptions = getRegisterReferess?.map((ref) => ({
    value: String(ref?.referee_id),
    label: (
      <div className="w-full flex items-center gap-2">
        <Avatar src={ref?.avatar} size={32} />
        <span>{ref?.name}</span>
      </div>
    ),
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  const onSubmit = (data) => {
    submitEvaluation(data);
    // console.log(data, "submitted");
  };

  // Handle success with SweetAlert2 and reset form
  if (isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Evaluation submitted successfully",
      timer: 2500,
      showConfirmButton: false,
    });
    resetForm(); // Reset form fields
    reset(); // Reset mutation state
  }

  // Handle error with SweetAlert2
  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.message || "Something went wrong!",
      timer: 3000,
      showConfirmButton: false,
    });
    reset(); // Reset mutation state
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-6 rounded-xl border border-black/10 shadow-sm flex flex-col gap-6"
    >
      <h2 className="text-2xl text-black">Evaluation Form</h2>

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
        options={convertedRefOptions}
        validationRules={{ required: "Please select a referee" }}
        errors={errors}
      />

      {/* Call / No Call Accuracy */}
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
        register_as="recommended_level"
        control={control}
        options={levelOptions}
        validationRules={{ required: "Required" }}
        errors={errors}
      />

      <CommonSubmitBtn
        variant="primary"
        className="mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoaderV2 /> : "Submit Evaluation"}
      </CommonSubmitBtn>
    </form>
  );
};

export default EvaluationForm;