import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const PrivacyPolicy = () => {
  const axiosInstance = useAxiosPublic();

  const { 
    data: apiResponse, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: () => axiosInstance.get("/privacy-policy").then(res => res.data),
    staleTime: 1000 * 60 * 10,   // 10 minutes
  });

  const policy = apiResponse?.data?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !policy?.description) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center text-gray-600">
          <p className="text-xl font-medium">Failed to load Privacy Policy</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-[#0099d1]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div 
          className="prose prose-lg prose-headings:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none"
          dangerouslySetInnerHTML={{ __html: policy.description }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;