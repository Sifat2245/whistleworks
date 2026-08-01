const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const RosterSkeleton = () => {
  return (
    <div className="w-full container mx-auto px-4 py-6">
      {/* Header row */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <div className="flex gap-2 bg-[#FAFAFA] border border-border p-1.5 rounded-[10px]">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>

      {/* Title */}
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 max-w-full mt-3" />

      {/* Search */}
      <Skeleton className="h-14 w-full rounded-xl mt-8" />

      {/* Content */}
      <div className="mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
            >
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24 mt-1.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white border border-border rounded-[10px] overflow-hidden">
          <div className="grid grid-cols-5 gap-3 px-5 md:px-6 py-4 border-b border-border bg-[#FAFAFA]">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-20" />
            ))}
          </div>

          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-3 px-5 md:px-6 py-5 border-b border-border last:border-b-0 items-center"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              </div>
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-16" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterSkeleton;
