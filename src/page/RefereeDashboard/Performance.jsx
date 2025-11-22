import OverallPerformance from "@/components/dashboard/refereeDashboard/Performance/OverallPerformance";
import PerformanceBreakdown from "@/components/dashboard/refereeDashboard/Performance/PerformanceBreakdown";

export default function Performance() {
  return (
    <section>
        <OverallPerformance />
        <PerformanceBreakdown />
    </section>
  )
}
