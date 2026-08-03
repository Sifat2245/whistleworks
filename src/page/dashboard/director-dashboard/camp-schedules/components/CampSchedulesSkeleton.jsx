const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const CampSchedulesSkeleton = () => {
  return (
    <div className="w-full pb-12">
      {/* Back button */}
      <div className="mb-4">
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Title */}
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72 max-w-full mt-3" />

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28 mt-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Search + table */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-full md:w-96 rounded-xl" />
      </div>

      <div className="mt-4 bg-white border border-border rounded-[10px] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-5 md:px-6 py-4 border-b border-border bg-[#FAFAFA]">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-24" />
          ))}
        </div>

        {/* Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-5 md:px-6 py-5 border-b border-border last:border-b-0"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3.5 w-20 mt-2" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-28 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampSchedulesSkeleton;
