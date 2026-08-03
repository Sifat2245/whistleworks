const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const RankingsSkeleton = () => {
  return (
    <div className="my-10">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16 mt-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-[10px] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-64 mt-2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        </div>

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[80px_1.4fr_1fr_repeat(6,0.7fr)_0.6fr_repeat(6,0.7fr)] gap-3 px-5 md:px-6 py-4 border-b border-border bg-[#FAFAFA]">
          {[...Array(16)].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full max-w-16" />
          ))}
        </div>

        {/* Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[80px_1.4fr_1fr_repeat(6,0.7fr)_0.6fr_repeat(6,0.7fr)] gap-3 px-5 md:px-6 py-5 border-b border-border last:border-b-0 items-center"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
            </div>
            {[...Array(14)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-10 justify-self-center hidden md:block" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingsSkeleton;
