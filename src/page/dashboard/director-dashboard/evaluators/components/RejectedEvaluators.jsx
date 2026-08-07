import { formatDistanceToNow } from "date-fns";
import PaginationV2 from "@/components/common/PaginationV2";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import EvaluatorSectionHeader from "./EvaluatorSectionHeader";
import EvaluatorStateCard from "./EvaluatorStateCard";
import {
  LuBan,
  LuMail,
  LuPhone,
  LuCalendarX,
  LuQuote,
} from "react-icons/lu";

const timeAgo = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return formatDistanceToNow(d, { addSuffix: true });
};

const RejectedEvaluators = ({
  rejectedEvaluatorData = [],
  pagination,
  onPageChange,
  isLoading = false,
  isError = false,
}) => {
  return (
    <section className="w-full">
      <EvaluatorSectionHeader
        icon={LuBan}
        title="Rejected Evaluators"
        subtitle="Applications that were declined for this camp"
        count={pagination.total}
        countLabel="rejected"
        tone="red"
      />

      {isError ? (
        <EvaluatorStateCard
          type="error"
          title="Failed to Load Rejected Evaluators"
          description="We couldn't load rejected applications. Please try again."
        />
      ) : isLoading ? (
        <EvaluatorListSkeleton count={4} />
      ) : rejectedEvaluatorData.length === 0 ? (
        <EvaluatorStateCard
          icon={LuBan}
          title="No Rejected Evaluators"
          description="Declined applications will appear here for your reference."
        />
      ) : (
        <div className="space-y-3">
          {rejectedEvaluatorData.map((evaluator) => (
            <div
              key={evaluator.id}
              className="group relative overflow-hidden bg-white border border-border rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-red-200 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              {/* Left accent revealed on hover */}
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Identity */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={evaluator.image || "/default-avatar.png"}
                    alt={evaluator.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-100 grayscale group-hover:grayscale-0 transition duration-300"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                    <LuBan className="w-2.5 h-2.5 text-red-500" />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#333] truncate">
                    {evaluator.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#666] mt-0.5 min-w-0">
                    <LuMail className="text-[#bbb] shrink-0" />
                    <span className="truncate">
                      {evaluator.evaluatorMail || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#666] shrink-0 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <LuPhone className="text-[#bbb]" />
                  <span>
                    {evaluator.isPhoneShow !== false &&
                    evaluator.evaluatorNumber
                      ? evaluator.evaluatorNumber
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LuCalendarX className="text-[#bbb]" />
                  <span>Rejected {timeAgo(evaluator.rejectedAt)}</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full font-semibold">
                  <LuBan className="w-3.5 h-3.5" /> Declined
                </span>
              </div>

              {/* Reason */}
              {evaluator.rejectionReason && (
                <div className="lg:w-72 shrink-0">
                  <p className="text-xs font-semibold text-red-500/80 mb-1.5 flex items-center gap-1">
                    <LuQuote className="w-3 h-3" /> Reason
                  </p>
                  <p
                    className="text-xs text-[#666] line-clamp-2 bg-red-50/60 border border-red-100 rounded-xl px-3.5 py-2.5 leading-relaxed"
                    title={evaluator.rejectionReason}
                  >
                    “{evaluator.rejectionReason}”
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination.total > 0 && (
        <PaginationV2
          handlePageClick={onPageChange}
          perPage={pagination.per_page}
          totalItem={pagination.total}
          currentPage={pagination.current_page}
        />
      )}
    </section>
  );
};

export default RejectedEvaluators;
