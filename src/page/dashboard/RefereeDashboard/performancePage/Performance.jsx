// Performance.jsx
import OverallPerformance from "@/page/dashboard/RefereeDashboard/performancePage/components/OverallPerformance";
import PerformanceBreakdown from "@/page/dashboard/RefereeDashboard/performancePage/components/PerformanceBreakdown";
import RecentFeedback from "@/page/dashboard/RefereeDashboard/performancePage/components/RecentFeedback";
import { useMyEvaluations } from "@/hooks/api/referee-hooks/useRefereePerformance";
import { useRecommendedLevels } from "@/hooks/api/useEvaluation";
import { resolveLevels } from "@/lib/recommendedLevels";
import { Spin } from "antd";

export default function Performance({ camp_id }) {
  const { data, isLoading } = useMyEvaluations(camp_id);

  // Recommended levels are driven by the camp's sports type
  // (e.g. HS Basketball → Large School Varsity ... JH/ELEM),
  // falling back to the legacy list while loading or for other sports.
  const { data: recommendedLevels = [] } =
    useRecommendedLevels(camp_id);
  const levels = resolveLevels(recommendedLevels);

  // Destructure properly
  const overallPerformance = data?.overall_performance || {};
  const performanceBreakdown = data?.performance_breakdown || {};
  const ranking = data?.ranking || {};
  const recentFeedback = data?.recent_feedback || [];
  const totalEvaluations = overallPerformance?.total_evaluations || 0;
  const recommendedLevel = data?.recommended_levels || [];

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
        ranking={ranking}
      />
      <PerformanceBreakdown
        breakdown={performanceBreakdown}
        recommendedLevel={recommendedLevel}
        hasEvaluations={hasEvaluations}
        levels={levels}
      />
      <RecentFeedback feedbackList={recentFeedback} />
    </section>
  );
}