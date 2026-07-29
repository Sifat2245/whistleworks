const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-100 rounded-md ${className}`} />
);

const MyCampCartSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 sm:h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="flex gap-2 shrink-0">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 sm:gap-10 mt-5 sm:mt-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-10 mb-1" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
          <Skeleton className="w-px h-10" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-10 mb-1" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg bg-slate-50"
            >
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-3 w-16 sm:w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCampCartSkeleton;
