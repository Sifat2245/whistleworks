import { FiTrash2 } from "react-icons/fi";

const ActiveEvalutorList2 = ({ activeEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 md:pb-10 font-semibold tracking-wide">
                ACTIVE EVALUATORS
            </h2>

            {/* active evaluators grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 border border-border rounded-xl p-4 sm:p-5 md:p-6 bg-white shadow-sm">
                {activeEvaluatorData?.map((evaluator) => (
                    <div
                        key={evaluator?.id || evaluator?.evaluatorNumber}
                        className="relative group border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-[#00AEEF] hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full"
                    >
                        {/* Remove evaluator button - positioned top right */}
                        <button
                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer transition-colors duration-200 opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Remove Evaluator"
                        >
                            <FiTrash2 className="text-white text-sm" />
                        </button>

                        {/* Profile Image */}
                        <div className="flex flex-col items-center mb-4">
                            <div className="size-20 sm:size-24 md:size-28 rounded-full overflow-hidden border-2 border-[#00AEEF] p-1 mb-3">
                                <img
                                    src={evaluator?.iamge}
                                    alt={evaluator?.name || "Evaluator"}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                        e.target.src = "/default-avatar.png";
                                    }}
                                />
                            </div>

                            {/* Name and Badge */}
                            <div className="text-center">
                                <h6 className="text-lg sm:text-xl font-semibold text-[#333] mb-1 truncate w-full">
                                    {evaluator?.name || "Unknown Evaluator"}
                                </h6>
                                <span className="inline-block bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-medium px-3 py-1 rounded-full">
                                    Evaluator
                                </span>
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="space-y-3 mt-2 flex-1">
                            {/* ID Number */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">ID:</span>
                                <p className="text-sm text-[#333] font-mono truncate">
                                    {evaluator?.evaluatorNumber || "N/A"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-500 mt-0.5">Email:</span>
                                <p className="text-sm text-[#00AEEF] truncate hover:text-[#0098d6] transition-colors cursor-pointer">
                                    {evaluator?.evaluatorMail || "no-email@example.com"}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-500 mt-0.5">Address:</span>
                                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                    {evaluator?.evaluatorAddress || "Address not available"}
                                </p>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs text-gray-600">Active</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    Since {evaluator?.joinDate || "2024"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {(!activeEvaluatorData || activeEvaluatorData.length === 0) && (
                <div className="w-full border border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 4.5V9.75m0 0l-3 3m3-3l3 3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Evaluators</h3>
                    <p className="text-gray-500 text-sm">Add evaluators to get started with the evaluation process.</p>
                </div>
            )}
        </div>
    );
};
export default ActiveEvalutorList2;