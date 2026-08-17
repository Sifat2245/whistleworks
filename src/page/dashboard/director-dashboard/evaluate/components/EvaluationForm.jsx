import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import SectionCard from "@/components/common/SectionCard";
import { Avatar } from "antd";
import { useForm } from "react-hook-form";
import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import {
  useSubmitEvaluation,
  useRecommendedLevels,
  buildEvaluationFormData,
} from "@/hooks/api/useEvaluation";
import { cn } from "@/lib/utils";
import {
  LuClipboardList,
  LuUserCheck,
  LuTarget,
  LuMessageSquareText,
  LuScale,
  LuFootprints,
  LuActivity,
  LuEye,
  LuHeart,
  LuMessageSquare,
  LuSend,
  LuRefreshCw,
} from "react-icons/lu";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
})).sort((a, b) => a.value - b.value);

const criteria = [
  {
    key: "call_accuracy",
    label: "Call/No Call Accuracy",
    hint: "Correct decisions on plays",
    icon: <LuTarget />,
  },
  {
    key: "communication_skills",
    label: "Communication Skills",
    hint: "Clarity with players & coaches",
    icon: <LuMessageSquareText />,
  },
  {
    key: "consistency_of_calls",
    label: "Consistency of Calls",
    hint: "Uniformity throughout the game",
    icon: <LuScale />,
  },
  {
    key: "court_position_mechanics",
    label: "Court Position / Mechanics",
    hint: "Positioning & movement",
    icon: <LuFootprints />,
  },
  {
    key: "fitness_mobility",
    label: "Fitness / Mobility",
    hint: "Endurance & agility",
    icon: <LuActivity />,
  },
  {
    key: "game_awareness",
    label: "Game Awareness",
    hint: "Reading the flow of play",
    icon: <LuEye />,
  },
];

const EvaluationForm = ({ camp_id, sports_type_name }) => {
  const { getRegisterReferess } = useRegisteredReferees(camp_id);

  // Recommended highest levels are driven by the camp's sports type
  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(sports_type_name);

  const levelOptions = recommendedLevels.map((level) => ({
    label: level,
    value: level,
  }));

  // Mutation for submitting evaluation (handles success/error toasts internally)
  const {
    mutate: submitEvaluation,
    isPending: isSubmitting,
    isSuccess,
    reset,
  } = useSubmitEvaluation(camp_id);

  // Convert referee options
  const convertedRefOptions = getRegisterReferess?.map((ref) => ({
    value: String(ref?.referee_id),
    label: (
      <div className="w-full flex items-center gap-2">
        <Avatar src={ref?.avatar} size={32} />
        <span>{ref?.name}</span>{" "}
        {ref?.jersey_number ? `#${ref?.jersey_number}` : ""}
      </div>
    ),
  }));

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  const watchedScores = watch(criteria.map((c) => c.key));
  const ratedCount = watchedScores.filter(
    (val) => val !== undefined && val !== null && val !== "",
  ).length;
  const progress = Math.round((ratedCount / criteria.length) * 100);

  // Reset form fields on successful submission
  if (isSuccess) {
    resetForm();
    reset();
  }

  const onSubmit = (data) => {
    const formData = buildEvaluationFormData(data, camp_id);
    submitEvaluation(formData);
  };

  return (
    <SectionCard
      icon={<LuClipboardList />}
      title="Evaluation Form"
      description="Rate the referee across each performance category"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 sm:p-7 flex flex-col gap-6"
      >
        {/* Referee selection */}
        <div className="bg-[#FAFAFA] border border-border rounded-[10px] p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <LuUserCheck className="text-primary text-lg" />
            <h3 className="font-medium text-[#333]">Who are you evaluating?</h3>
          </div>
          <CommonInputWrapper
            type="select"
            label="Select A Referee"
            placeholder="+ Select A Referee"
            register_as="referee_id"
            control={control}
            options={convertedRefOptions}
            validationRules={{ required: "Please select a referee" }}
            errors={errors}
          />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg text-[#333]">
              Performance Criteria
            </h3>
            <span className="text-sm font-medium text-[#666]">
              {ratedCount}/{criteria.length} rated
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-green-500" : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Criteria grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((item) => (
            <div
              key={item.key}
              className="border border-border rounded-[10px] p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">
                  {item.icon}
                </span>
                <div>
                  <p className="font-medium text-[#333] text-sm leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#666] mt-0.5">{item.hint}</p>
                </div>
              </div>
              <CommonInputWrapper
                type="select"
                placeholder="Select score (1-10)"
                register_as={item.key}
                control={control}
                options={scoreOptions}
                validationRules={{ required: "Required" }}
                errors={errors}
              />
            </div>
          ))}
        </div>

        {/* Comments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="referee_feedback"
              className="capitalize font-medium text-[#333] text-base flex items-center gap-2"
            >
              <LuHeart className="text-primary" /> Referee Feedback
            </label>
            <CommonInputWrapper
              type="textarea"
              textareaClass={"border-black/15"}
              placeholder="Write feedback for the referee..."
              register_as="referee_feedback"
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="private_comments"
              className="capitalize font-medium text-[#333] text-base flex items-center gap-2"
            >
              <LuMessageSquare className="text-primary" /> Private Comments
              <span className="text-xs text-[#999] normal-case">
                (directors & evaluators only)
              </span>
            </label>
            <CommonInputWrapper
              type="textarea"
              textareaClass={"border-black/15"}
              placeholder="Write private comments..."
              register_as="private_comments"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        {/* Highest level recommendation */}
        <div className="max-w-md">
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
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border">
          <CommonSubmitBtn
            variant="primary"
            className="sm:flex-1 justify-center"
            type="submit"
            isLoading={isSubmitting}
          >
            <span className="inline-flex items-center gap-2">
              <LuSend className="text-base" /> Submit Evaluation
            </span>
          </CommonSubmitBtn>
          <button
            type="button"
            onClick={() => resetForm()}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg border border-border text-[#666] hover:bg-gray-50 transition font-medium cursor-pointer"
          >
            <LuRefreshCw className="text-base" /> Clear
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

export default EvaluationForm;