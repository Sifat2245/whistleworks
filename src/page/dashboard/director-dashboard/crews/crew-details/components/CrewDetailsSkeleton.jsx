const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const CrewDetailsSkeleton = () => {
  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <Skeleton className="h-10 w-44 rounded-lg" />

      <div className="mt-6">
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[10px] px-4 py-4 flex items-center gap-3"
          >
            <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-24 mt-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="mt-12">
        <div className="flex items-center gap-3.5 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-56 mt-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-[10px] p-5 flex flex-col items-center text-center"
            >
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-32 mt-4" />
              <Skeleton className="h-3 w-44 mt-2" />
              <Skeleton className="h-3 w-28 mt-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrewDetailsSkeleton;
