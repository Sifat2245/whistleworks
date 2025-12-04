import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useForm } from "react-hook-form";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

const EvaluationForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Evaluation Submitted:", data);
  };

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
        register_as="referee"
        control={control}
        options={[
          { label: "Referee 1", value: "ref1" },
          { label: "Referee 2", value: "ref2" },
        ]}
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
        register_as="court_mechanics"
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
        register_as="fitness"
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
        register_as="highest_level"
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

      <CommonSubmitBtn variant="primary" className="mt-2">
        Submit Evaluation
      </CommonSubmitBtn>
    </form>
  );
};

export default EvaluationForm;
