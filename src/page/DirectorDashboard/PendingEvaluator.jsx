const PendingEvaluator = ({ pendingEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-2xl text-[#333333] uppecase pb-10">
                PENDING EVALUATORS
            </h2>

            {/* pending evaluators */}
            <div className="w-full grid grid-cols-1 gap-3 border border-border rounded-xl p-4 h-[500px] overflow-y-scroll">
                {
                    pendingEvaluatorData?.map((evaluator) => {
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

                                {/* approved and deny button */}
                                <div className="flex items-center gap-3">
                                    <button className="text-sm bg-[#179F30] text-white font-medium rounded-sm py-3 px-5 cursor-pointer border border-[#179F30] hover:bg-transparent hover:text-[#179F30] transition-all duration-300">
                                        Approved
                                    </button>

                                    <button className="text-sm bg-red-400 text-white rounded-sm py-3 px-5 cursor-pointer border border-red-400 hover:bg-transparent hover:text-red-400 transition-all duration-300">
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