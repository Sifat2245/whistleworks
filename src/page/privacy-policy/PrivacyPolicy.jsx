import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const PrivacyPolicy = () => {
  const axiosInstance = useAxiosPublic();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: () => axiosInstance.get("/privacy-policy").then((res) => res.data),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Support both object and array response formats safely
  const rawData = apiResponse?.data ?? apiResponse;
  const policy = Array.isArray(rawData) ? rawData[0] : rawData;
  const rawDescription =
    policy?.description ?? (typeof policy === "string" ? policy : "");

  // Very minimal client-side HTML cleanup (not real sanitization, just basic)
  // We remove <script>, <iframe>, <object>, <embed>, onclick=... etc.
  const basicSafeHtml = rawDescription
    ? rawDescription
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        // Remove event handlers (very basic regex – not 100% reliable)
        .replace(/\s(on\w+)=["'][^"']*["']/gi, "")
        // Remove dangerous tags
        .replace(/<\/?(iframe|object|embed|style|link|meta|form|input|button|textarea|select)[^>]*>/gi, "")
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !policy || !basicSafeHtml.trim()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Couldnt load Privacy Policy
          </h2>
          <p className="text-gray-600 mb-6">
            {isError && error instanceof Error
              ? error.message
              : "No content available"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto">
        {/* 
          Important notes:
          - We still use dangerouslySetInnerHTML → there is residual XSS risk
          - The regex cleaning above is VERY limited – only removes obvious dangerous patterns
          - Best long-term solution = don't send raw HTML from backend
        */}
        <div
          className="prose prose-lg sm:prose-xl prose-headings:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: basicSafeHtml }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;