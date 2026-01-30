import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const TermsAndConditions = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: () =>
      axiosPublic.get("/terms-and-conditions").then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const termsHtml = apiResponse?.data?.description ?? "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !termsHtml.trim()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Failed to load Terms & Conditions
          </h2>
          <p className="text-gray-600 mb-6">
            Please check your connection or try again later.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto container">
        <div
          className={`
            prose 
            prose-slate 
            prose-headings:text-gray-900 
            prose-a:text-primary 
            prose-a:no-underline 
            hover:prose-a:underline 
            max-w-none
            prose-li:marker:text-primary/80
          `}
          dangerouslySetInnerHTML={{ __html: termsHtml }}
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;
