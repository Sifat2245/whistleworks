import { FiTrash2 } from "react-icons/fi";

const ActiveEvalutorList = ({ activeEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 md:pb-10">
                ACTIVE EVALUATORS
            </h2>

            {/* active evaluators */}
            <div className="w-full grid grid-cols-1 gap-3 sm:gap-4 border border-border rounded-xl p-3 sm:p-4 md:p-6 h-[400px] sm:h-[450px] md:h-[500px] overflow-y-auto">
                {
                    activeEvaluatorData?.map((evaluator) => {
                        return (
                            <div
                                key={evaluator}
                                className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center border border-border rounded-xl p-3 sm:p-4 gap-3 sm:gap-0"
                            >
                                {/* image and information */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                                    {/* image */}
                                    <div className="size-[50px] sm:size-[55px] md:size-[60px] rounded-full shrink-0">
                                        <img
                                            src={evaluator?.iamge}
                                            alt={evaluator?.name || "unknown"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    {/* information */}
                                    <div className="flex flex-col gap-1 sm:gap-1.5 text-[#333] w-full sm:w-auto">
                                        <h6 className="text-base sm:text-lg font-medium truncate">{evaluator?.name}</h6>
                                        <p className="text-xs sm:text-sm truncate">{evaluator?.evaluatorNumber}</p>
                                        <p className="text-xs sm:text-sm text-[#00AEEF] truncate">{evaluator?.evaluatorMail}</p>
                                        <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">{evaluator?.evaluatorAddress}</p>
                                    </div>
                                </div>

                                {/* remove evaluator button */}
                                <button className="bg-red-400 rounded-sm py-2 px-4 sm:py-3 sm:px-5 cursor-pointer self-end sm:self-auto mt-2 sm:mt-0">
                                    <FiTrash2 className="text-base sm:text-lg text-white" />
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