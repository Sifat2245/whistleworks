const PendingEvaluator = ({ pendingEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 md:pb-10">
                PENDING EVALUATORS
            </h2>

            {/* pending evaluators */}
            <div className="w-full grid grid-cols-1 gap-3 sm:gap-4 border border-border rounded-xl p-3 sm:p-4 md:p-6 h-[400px] sm:h-[450px] md:h-[500px] overflow-y-auto">
                {
                    pendingEvaluatorData?.map((evaluator) => {
                        return (
                            <div
                                key={evaluator}
                                className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center border border-border rounded-xl p-3 sm:p-4 gap-4 sm:gap-3 md:gap-0"
                            >
                                {/* image and information */}
                                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                                    {/* image */}
                                    <div className="size-[50px] sm:size-[55px] md:size-[60px] rounded-full shrink-0">
                                        <img
                                            src={evaluator?.iamge}
                                            alt={evaluator?.name || "unknown"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    {/* information */}
                                    <div className="flex flex-col gap-1.5 text-[#333] flex-1 min-w-0">
                                        <h6 className="text-base sm:text-lg font-medium truncate">{evaluator?.name}</h6>
                                        <p className="text-xs sm:text-sm truncate">{evaluator?.evaluatorNumber}</p>
                                        <p className="text-xs sm:text-sm text-[#00AEEF] truncate">{evaluator?.evaluatorMail}</p>
                                        <p className="text-xs sm:text-sm line-clamp-2">{evaluator?.evaluatorAddress}</p>
                                    </div>
                                </div>

                                {/* approved and deny button */}
                                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end sm:justify-normal mt-2 sm:mt-0">
                                    <button
                                        className="text-xs sm:text-sm bg-[#179F30] text-white font-medium rounded-sm py-2 px-3 sm:py-3 sm:px-5 cursor-pointer border border-[#179F30] hover:bg-transparent hover:text-[#179F30] transition-all duration-300 flex-1 sm:flex-none text-center"
                                    >
                                        Approved
                                    </button>

                                    <button
                                        className="text-xs sm:text-sm bg-red-400 text-white rounded-sm py-2 px-3 sm:py-3 sm:px-5 cursor-pointer border border-red-400 hover:bg-transparent hover:text-red-400 transition-all duration-300 flex-1 sm:flex-none text-center"
                                    >
                                        Deny
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};
export default PendingEvaluator;