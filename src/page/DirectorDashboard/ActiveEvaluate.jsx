import evaluatorImage from "@/assets/dashboard/evaluator_image.png";
import PendingEvaluator from "./PendingEvaluator";
import ActiveEvalutorList from "./ActiveEvalutorList";

// Note: active evaluator data
const activeEvaluatorData = [
    {
        id: 1,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "Sycolin Rd, Leesburg, VA, USA",
        evaluatorNumber: "918-229-2928",
    },
    {
        id: 2,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 3,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 4,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 5,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 6,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 7,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
];
// Note: pending evaluator data
const pendingEvaluatorData = [
    {
        id: 1,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "Sycolin Rd, Leesburg, VA, USA",
        evaluatorNumber: "918-229-2928",
    },
    {
        id: 2,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 3,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 4,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 5,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 6,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 7,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
];

const ActiveEvaluate = () => {
    return (
        <div className="w-full flex flex-col items-start gap-10">
            <ActiveEvalutorList activeEvaluatorData={activeEvaluatorData} />
            <PendingEvaluator
                pendingEvaluatorData={pendingEvaluatorData}
            />
        </div>
    );
};
export default ActiveEvaluate;