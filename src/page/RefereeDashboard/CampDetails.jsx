import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useSearchParams } from "react-router-dom";
import CampDetailsTabs from "@/components/dashboard/refereeDashboard/CampDetailsTabs";

export default function CampDetails() {
    const [queryParams] = useSearchParams();
    const tab = queryParams.get("tab");
    console.log("tab", tab);
  return (
    <section className="w-full container px-4 mt-7 mb-18">
      <div className="flex items-center justify-between">
        <ActiveCmpsBackBtn label="Active Camps" />
        <CampDetailsTabs />
      </div>
    </section>
  );
}
