import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useSearchParams } from "react-router-dom";
import CampDetailsTabs from "@/components/dashboard/refereeDashboard/CampDetailsTabs";
import { Divider } from "antd";
import CampDetails from "@/components/dashboard/refereeDashboard/CampDetails";
import MyGames from "@/components/dashboard/refereeDashboard/MyGames";
import Performance from "./Performance";
import Roster from "./Roster";
import EvolatorCampTabs from "@/components/dashboard/evaluatorDashboard/ActiveCamps/EvolatorCampTabs";

export default function CampDetailsPage() {
  const pathname = window.location.pathname;
    const [queryParams] = useSearchParams();
    const tab = queryParams.get("tab");
  return (
    <section className="w-full mt-7 mb-18">
      <div className="md:flex items-center justify-between container px-4">
        <ActiveCmpsBackBtn label="Active Camps" />
        {pathname.includes("evolator-dashboard") ? <EvolatorCampTabs /> : <CampDetailsTabs />}
      </div>
      <Divider className="my-6" />
      <div className="container px-4">
        {tab === "camp-details" && <CampDetails />}
        {tab === "roster" && <Roster />}
        {tab === "performance" && <Performance />}
        {tab === "my-games" && <MyGames />}
        {tab === "ranking-report" && <div>Ranking Report Content</div>}
        {tab === "evaluate" && <div> Evaluate Report Content</div>}
        {tab === "schedule" && <div>Schedule Content</div>}
      </div>
    </section>
  );
}
