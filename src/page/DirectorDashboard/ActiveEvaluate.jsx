import evaluatorImage from "@/assets/dashboard/evaluator_image.png";
import ActiveEvalutorList2 from "./ActiveEvalutorList2";
import BackBtn from "@/components/common/BackBtn";
import PendingEvaluator2 from "./PendingEvaluator2";

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
    {
        id: 8,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 9,
        iamge: evaluatorImage,
        name: "Zobayer",
        evaluatorMail: "evaluatorl@gmail.com",
        evaluatorAddress: "",
        evaluatorNumber: "",
    },
    {
        id: 10,
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
            <BackBtn />
            <ActiveEvalutorList2 activeEvaluatorData={activeEvaluatorData} />
            <PendingEvaluator2
                pendingEvaluatorData={pendingEvaluatorData}
            />
        </div>
    );
};
export default ActiveEvaluate;