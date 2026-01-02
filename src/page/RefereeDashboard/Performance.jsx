// Performance.jsx (Main Page)
import OverallPerformance from "@/components/dashboard/refereeDashboard/Performance/OverallPerformance";
import PerformanceBreakdown from "@/components/dashboard/refereeDashboard/Performance/PerformanceBreakdown";
import RecentFeedback from "@/components/dashboard/refereeDashboard/Performance/RecentFeedback";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function Performance() {
  const axiosInstance = useAxiosSecure();

  const { data: evaluationsData = {}, isLoading } = useQuery({
    queryKey: ["my-evaluations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/referee/my-evaluations");
      return res?.data?.data || {};
    },
  });

  const evaluations = evaluationsData.evaluations || [];

  // Pass evaluations to child components
  return (
    <section className="space-y-8">
      <OverallPerformance evaluations={evaluations} isLoading={isLoading} />
      <PerformanceBreakdown evaluations={evaluations} isLoading={isLoading} />
      <RecentFeedback evaluations={evaluations} isLoading={isLoading} />
    </section>
  );
}