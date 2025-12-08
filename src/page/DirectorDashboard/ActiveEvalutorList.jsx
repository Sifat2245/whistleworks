import { FiTrash2 } from "react-icons/fi";

const ActiveEvalutorList = ({ activeEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-2xl text-[#333333] uppercase pb-10">
                ACTIVE EVALUATORS
            </h2>

            {/* active evaluators */}
            <div className="w-full grid grid-cols-1 gap-3 border border-border rounded-xl p-4 h-[500px] overflow-y-scroll">
                {
                    activeEvaluatorData?.map((evaluator) => {
                        return (
                            <div
                                key={evaluator}
                                className="w-full flex justify-between items-center border border-border rounded-xl p-3"
                            >
                                {/* image and information */}
                                <div className="flex items-center gap-3">
                                    {/* image */}
                                    <div className="size-[60px] rounded-full">
                                        <img
                                            src={evaluator?.iamge}
                                            alt={evaluator?.name || "unknown"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    {/* information */}
                                    <div className="flex flex-col gap-1.5 text-[#333]">
                                        <h6 className="text-lg font-medium">{evaluator?.name}</h6>
                                        <p className="text-sm">{evaluator?.evaluatorNumber}</p>
                                        <p className="text-sm text-[#00AEEF]">{evaluator?.evaluatorMail}</p>
                                        <p className="text-sm">{evaluator?.evaluatorAddress}</p>
                                    </div>
                                </div>

                                {/* remove evaluator button */}
                                <button className="bg-red-400 rounded-sm py-3 px-5 cursor-pointer">
                                    <FiTrash2 className="text-lg text-white" />
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ActiveEvalutorList;