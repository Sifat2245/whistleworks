const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
);

const EvaluatorListSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-border rounded-2xl p-5"
        >
          <div className="flex justify-end mb-4">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          <div className="flex flex-col items-center mb-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-5 w-28 mt-3.5" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluatorListSkeleton;
