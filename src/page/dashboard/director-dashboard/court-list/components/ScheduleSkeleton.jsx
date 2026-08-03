// components/schedule/ScheduleSkeleton.jsx

const ScheduleSkeleton = () => {
  return (
    <div className="w-full mt-6 mb-16 animate-pulse">
      {/* Skeleton Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-300 rounded w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Coverage */}
      <div className="bg-white border border-border rounded-[10px] px-4 sm:px-5 py-3.5 mt-3 sm:mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-2.5 bg-gray-200 rounded w-32" />
          <div className="h-2.5 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-2.5" />
      </div>

      {/* Skeleton Date Tabs */}
      <div className="mt-6">
        <div className="h-2.5 bg-gray-200 rounded w-16 mb-2" />
        <div className="flex gap-2 overflow-hidden pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-gray-100 border border-border rounded-full" />
          ))}
        </div>
      </div>

      {/* Skeleton Desktop Table (lg+) */}
      <div className="hidden lg:block w-full border border-border rounded-2xl overflow-hidden bg-white mt-6">
        <div className="overflow-hidden">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex border-b border-border bg-[#FAFAFA]">
              <div className="w-28 shrink-0 px-4 py-4 border-r border-border">
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
              </div>
              <div className="flex">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shrink-0 w-64 px-4 py-4 text-center space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32 mx-auto" />
                    <div className="h-2.5 bg-gray-200 rounded w-24 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {[...Array(10)].map((_, rowIdx) => (
              <div key={rowIdx} className="flex border-b border-border">
                <div className="w-28 shrink-0 px-4 py-5 border-r border-border">
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
                </div>
                <div className="flex gap-4 px-4 py-4">
                  {[...Array(6)].map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="shrink-0 w-64 h-[230px] rounded-xl bg-gray-100 border border-border"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton Mobile Cards (<lg) */}
      <div className="lg:hidden space-y-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#FAFAFA] border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-16" />
                  <div className="h-2.5 bg-gray-200 rounded w-12" />
                </div>
              </div>
              <div className="h-7 w-24 bg-gray-100 border border-border rounded-full" />
            </div>
            <div className="divide-y divide-border">
              {[...Array(3)].map((_, cIdx) => (
                <div key={cIdx} className="px-4 py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 bg-gray-200 rounded w-24" />
                    <div className="h-7 w-16 bg-gray-100 border border-border rounded-full" />
                  </div>
                  <div className="h-12 bg-gray-100 border border-border rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="h-12 w-full lg:w-40 bg-red-200 rounded-xl" />
          <div className="h-12 w-full lg:w-40 bg-gray-200 rounded-xl" />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="h-12 w-full lg:w-48 bg-gray-200 rounded-xl" />
          <div className="h-12 w-full lg:w-48 bg-primary/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSkeleton;
