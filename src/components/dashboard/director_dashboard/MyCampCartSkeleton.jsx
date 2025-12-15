const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

const MyCampCartSkeleton = () => {

    // Note: main ui component
    return (
        <div className="border border-[#E8E8E8] rounded-lg p-3 md:p-5 lg:p-6 w-full animate-pulse">

            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">

                {/* Image + Name */}
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <Skeleton className="size-8 md:size-10 rounded-full shrink-0" />

                    <div className="w-full min-w-0">
                        <Skeleton className="h-4 sm:h-5 w-32 md:w-40 mb-2" />
                        <Skeleton className="h-3 sm:h-4 w-24 md:w-32" />
                    </div>
                </div>

                {/* Status */}
                <Skeleton className="h-6 sm:h-7 md:h-8 w-20 sm:w-28 rounded-md" />
            </div>

            {/* Referees + Courts */}
            <div className="flex flex-col sm:flex-row items-center justify-around mt-4 sm:mt-5 md:mt-6 gap-4 sm:gap-0">
                <div className="text-center w-full sm:w-auto">
                    <Skeleton className="h-6 sm:h-7 md:h-8 w-10 sm:w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-16 mx-auto" />
                </div>

                <div className="hidden sm:block h-12 w-px bg-[#E8E8E8]"></div>
                <div className="block sm:hidden h-px w-full bg-[#E8E8E8]"></div>

                <div className="text-center w-full sm:w-auto">
                    <Skeleton className="h-6 sm:h-7 md:h-8 w-10 sm:w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-16 mx-auto" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border border-[#E8E8E8] p-2 sm:p-3 rounded-md bg-[#F5F5F5]"
                    >
                        <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-md" />
                        <Skeleton className="h-3 w-16 sm:w-20 md:w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCampCartSkeleton;
