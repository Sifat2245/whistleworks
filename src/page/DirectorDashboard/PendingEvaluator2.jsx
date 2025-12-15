import { FiCheck, FiX } from "react-icons/fi";

const PendingEvaluator2 = ({ pendingEvaluatorData }) => {
    return (
        <div className="w-full">
            <h2 className="w-full text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 md:pb-10 font-semibold tracking-wide flex items-center gap-3">
                PENDING EVALUATORS <p className="text-xl">( {pendingEvaluatorData?.length} PENDING EVALUATORS)</p>
            </h2>

            {/* pending evaluators grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-gray-50 shadow-sm">
                {pendingEvaluatorData?.map((evaluator) => (
                    <div
                        key={evaluator?.id || evaluator?.evaluatorNumber}
                        className="relative group border border-gray-300 rounded-xl p-4 sm:p-5 hover:border-[#179F30]/50 hover:shadow-md transition-all duration-300 bg-white"
                    >
                        {/* Pending Badge */}
                        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            Pending
                        </div>

                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-4 pt-2">
                            <div className="relative size-20 sm:size-24 md:size-28 rounded-full overflow-hidden border-2 border-gray-300 p-1 mb-3">
                                <img
                                    src={evaluator?.iamge || "/default-avatar.png"}
                                    alt={evaluator?.name || "Evaluator"}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                        e.target.src = "/default-avatar.png";
                                    }}
                                />
                                {/* Pending overlay */}
                                <div className="absolute inset-0 bg-yellow-50/30 rounded-full"></div>
                            </div>

                            {/* Name */}
                            <div className="text-center">
                                <h6 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 truncate w-full">
                                    {evaluator?.name || "Unknown Evaluator"}
                                </h6>
                                <p className="text-sm text-gray-500">Awaiting Approval</p>
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="space-y-3 mb-4">
                            {/* ID Number */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 shrink-0">ID:</span>
                                <p className="text-sm text-gray-700 font-mono truncate bg-gray-50 px-2 py-1 rounded">
                                    {evaluator?.evaluatorNumber || "N/A"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-500 mt-0.5 shrink-0">Email:</span>
                                <p className="text-sm text-blue-600 truncate hover:text-blue-800 transition-colors">
                                    {evaluator?.evaluatorMail || "no-email@example.com"}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-500 mt-0.5 shrink-0">Address:</span>
                                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                    {evaluator?.evaluatorAddress || "Address not provided"}
                                </p>
                            </div>

                            {/* Application Date */}
                            {evaluator?.applicationDate && (
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Applied on:</p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(evaluator.applicationDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-gray-100">
                            <button
                                className="flex items-center justify-center gap-2 bg-[#179F30] text-white font-medium rounded-lg py-2.5 px-4 cursor-pointer hover:bg-[#128a27] transition-all duration-300 shadow-sm hover:shadow-md flex-1 group/approve"
                                title="Approve Evaluator"
                            >
                                <FiCheck className="text-base group-hover/approve:scale-110 transition-transform" />
                                <span>Approve</span>
                            </button>

                            <button
                                className="flex items-center justify-center gap-2 bg-red-500 text-white font-medium rounded-lg py-2.5 px-4 cursor-pointer hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md flex-1 group/deny"
                                title="Deny Application"
                            >
                                <FiX className="text-base group-hover/deny:scale-110 transition-transform" />
                                <span>Deny</span>
                            </button>
                        </div>

                        {/* Quick Actions */}
                        {/* <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <button 
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                title="View Details"
                            >
                                View Details
                            </button>
                            <button 
                                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                title="Send Reminder"
                            >
                                Send Reminder
                            </button>
                        </div> */}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {(!pendingEvaluatorData || pendingEvaluatorData.length === 0) && (
                <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Pending Evaluators</h3>
                    <p className="text-gray-500 text-sm">All evaluator applications have been processed.</p>
                    <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Approved Evaluators →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PendingEvaluator2;