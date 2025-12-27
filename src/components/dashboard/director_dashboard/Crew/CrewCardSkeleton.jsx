// components/dashboard/director_dashboard/Crew/CrewCardSkeleton.jsx
const CrewCardSkeleton = () => {
  return (
    <div className="relative bg-white rounded-2xl border border-black/15 shadow-sm overflow-hidden animate-pulse">
      {/* Gradient header strip skeleton */}
      <div className="h-2 w-full bg-linear-to-r from-gray-300 to-gray-200" />

      {/* Crew ID badge skeleton */}
      <div className="absolute top-4 right-4">
        <div className="bg-gray-300 w-11 h-11 rounded-xl" />
      </div>

      {/* Header skeleton */}
      <div className="p-6 pb-5 border-b border-black/15 bg-gray-50/60">
        <div className="h-7 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />

        {/* Status badge skeleton */}
        <div className="inline-block mt-3">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
      </div>

      {/* Members Section skeleton */}
      <div className="p-6">
        {/* Meta row skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        {/* Member items skeleton (showing 4-5 for realism) */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 border border-black/10 rounded-xl px-3 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrewCardSkeleton;