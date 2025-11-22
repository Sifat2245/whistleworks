import OverallPerformance from "@/components/dashboard/refereeDashboard/Performance/OverallPerformance";
import PerformanceBreakdown from "@/components/dashboard/refereeDashboard/Performance/PerformanceBreakdown";
import RecentFeedback from "@/components/dashboard/refereeDashboard/Performance/RecentFeedback";

export default function Performance() {
  return (
    <section>
        <OverallPerformance />
        <PerformanceBreakdown />
        <RecentFeedback />
    </section>
  )
}
