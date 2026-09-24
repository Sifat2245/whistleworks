export default function CampDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-72 sm:h-96 bg-linear-to-r from-primary to-sky-600 animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-100 my-8" />
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-100 animate-pulse rounded" />
            <div className="h-3 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-3 w-5/6 bg-gray-100 animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
