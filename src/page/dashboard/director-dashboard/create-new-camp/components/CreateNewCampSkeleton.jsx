const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

const Card = ({ children }) => (
  <div className="bg-white border border-border rounded-[10px] overflow-hidden">
    <div className="px-5 sm:px-7 py-5 border-b border-border flex items-center gap-3.5">
      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-64 max-w-full mt-2" />
      </div>
    </div>
    <div className="p-5 sm:p-7">{children}</div>
  </div>
);

const CreateNewCampSkeleton = () => {
  return (
    <div className="w-full pb-12">
      {/* Back button */}
      <div className="mb-4 sm:mb-6">
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Title */}
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full mt-3" />

      <div className="w-full flex flex-col gap-6 sm:gap-8 mt-6">
        {/* Camp Basics */}
        <Card>
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg mt-4" />
        </Card>

        {/* Location & Timezone */}
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </Card>

        {/* Dates & Sport */}
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg lg:col-span-2" />
          </div>
        </Card>

        {/* Camp Details (editor) */}
        <Card>
          <div className="flex items-center gap-2 border border-border rounded-lg p-2 mb-3">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-lg" />
        </Card>

        {/* Pricing */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Skeleton className="h-12 w-full sm:w-72 rounded-lg" />
            <Skeleton className="h-5 w-44" />
          </div>
        </Card>

        {/* Submit / Reset */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CreateNewCampSkeleton;
