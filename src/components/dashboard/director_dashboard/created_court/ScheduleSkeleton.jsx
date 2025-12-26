// components/schedule/ScheduleSkeleton.jsx

const ScheduleSkeleton = () => {
  return (
    <div className="w-full mt-6 mb-16 animate-pulse">
      {/* Skeleton Date Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-6">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 bg-gray-100 rounded-xl px-10 py-5 min-w-[160px]"
          >
            <div className="h-5 bg-gray-300 rounded w-28 mx-auto" />
          </div>
        ))}
      </div>

      {/* Skeleton Table */}
      <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
        <div className="max-h-[90vh] overflow-hidden">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex gap-6 bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
              <div className="w-32 shrink-0 px-6 py-6 sticky left-0 bg-gray-50 z-30 border-r border-gray-200">
                <div className="h-6 bg-gray-300 rounded w-16" />
              </div>
              <div className="flex gap-6 py-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shrink-0 w-72 text-center">
                    <div className="h-4 bg-gray-300 rounded w-40 mx-auto mb-2" />
                    <div className="h-8 bg-gray-400 rounded w-32 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {[...Array(12)].map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex gap-6 border-b border-gray-200"
              >
                <div className="w-32 shrink-0 px-6 py-10 sticky left-0 bg-white z-10 border-r border-gray-200">
                  <div className="h-6 bg-gray-300 rounded w-24" />
                </div>
                <div className="flex gap-6 py-8">
                  {[...Array(6)].map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="shrink-0 w-72 h-52 rounded-xl bg-gray-100 shadow-md"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton Action Buttons */}
      <div className="flex justify-between items-center mt-10">
        <div className="flex gap-6">
          <div className="h-12 w-40 bg-red-200 rounded-lg" />
          <div className="h-12 w-40 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex gap-6">
          <div className="h-12 w-48 bg-gray-200 rounded-lg" />
          <div className="h-12 w-48 bg-primary/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSkeleton;