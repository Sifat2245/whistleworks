// Performance.jsx
import OverallPerformance from "@/components/dashboard/refereeDashboard/Performance/OverallPerformance";
import PerformanceBreakdown from "@/components/dashboard/refereeDashboard/Performance/PerformanceBreakdown";
import RecentFeedback from "@/components/dashboard/refereeDashboard/Performance/RecentFeedback";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function Performance({ camp_id }) {
  const axiosInstance = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["referee-performance", camp_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/referee/my-evaluations/${camp_id}`);
      return res?.data?.data; // Extract the inner `data`
    },
  });

  // Destructure properly
  const overallPerformance = data?.overall_performance || {};
  const performanceBreakdown = data?.performance_breakdown || {};
  const recentFeedback = data?.recent_feedback || [];
  const totalEvaluations = overallPerformance?.total_evaluations || 0;

  const hasEvaluations = totalEvaluations > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <OverallPerformance
        overallPerformance={overallPerformance}
        hasEvaluations={hasEvaluations}
      />
      <PerformanceBreakdown
        breakdown={performanceBreakdown}
        hasEvaluations={hasEvaluations}
      />
      <RecentFeedback feedbackList={recentFeedback} />
    </section>
  );
}