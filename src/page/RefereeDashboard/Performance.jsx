import OverallPerformance from "@/components/dashboard/refereeDashboard/Performance/OverallPerformance";
import PerformanceBreakdown from "@/components/dashboard/refereeDashboard/Performance/PerformanceBreakdown";
import RecentFeedback from "@/components/dashboard/refereeDashboard/Performance/RecentFeedback";
import TrainingGoals from "@/components/dashboard/refereeDashboard/Performance/TrainingGoals";

export default function Performance() {
  return (
    <section>
        <OverallPerformance />
        <PerformanceBreakdown />
        <RecentFeedback />
        <TrainingGoals />
    </section>
  )
}
