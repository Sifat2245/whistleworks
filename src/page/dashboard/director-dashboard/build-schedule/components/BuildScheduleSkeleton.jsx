const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const SkeletonCard = ({ children }) => (
  <div className="bg-white border border-border rounded-[10px] overflow-hidden">
    {children}
  </div>
);

const SkeletonCardHeader = () => (
  <div className="flex items-center gap-3.5 px-5 sm:px-7 py-5 border-b border-border">
    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
    <div className="flex-1 max-w-md">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3.5 w-64 mt-2" />
    </div>
  </div>
);

const BuildScheduleSkeleton = () => {
  return (
    <div className="w-full pb-12">
      {/* Back button */}
      <div className="mb-4">
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Page title */}
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-4 w-96 max-w-full mt-3" />

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

      {/* Daily Time Ranges */}
      <div className="mt-8 flex flex-col gap-6 sm:gap-8">
        <SkeletonCard>
          <SkeletonCardHeader />
          <div className="p-5 sm:p-7 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 sm:p-5 bg-[#FAFAFA] border border-border rounded-[10px]"
              >
                <div className="flex items-center gap-3 md:w-48 shrink-0">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16 mt-1.5" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 flex-1">
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-16 mb-2" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <span className="hidden sm:block text-xl text-[#BBB] pb-3">
                    →
                  </span>
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-16 mb-2" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Game Setup */}
        <SkeletonCard>
          <SkeletonCardHeader />
          <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3.5 w-32 mb-2" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Locations & Courts */}
        <SkeletonCard>
          <SkeletonCardHeader />
          <div className="p-5 sm:p-7 space-y-4">
            {/* Timezone notice */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <Skeleton className="w-6 h-6 rounded-md shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-3.5 w-full mt-2" />
                <Skeleton className="h-3.5 w-3/4 mt-2" />
              </div>
            </div>

            {/* Location card */}
            <div className="border border-border rounded-[10px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAFAFA] border-b border-border">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Skeleton className="h-3.5 w-32 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3.5 w-24 mb-2" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Add location */}
            <div className="w-full border-2 border-dashed border-border rounded-[10px] py-4 flex items-center justify-center">
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </SkeletonCard>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <Skeleton className="h-4 w-80 max-w-full" />
          <Skeleton className="h-12 w-52 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default BuildScheduleSkeleton;
