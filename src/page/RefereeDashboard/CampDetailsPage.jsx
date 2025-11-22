import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useSearchParams } from "react-router-dom";
import CampDetailsTabs from "@/components/dashboard/refereeDashboard/CampDetailsTabs";
import { Divider } from "antd";
import CampDetails from "@/components/dashboard/refereeDashboard/CampDetails";
import MyGames from "@/components/dashboard/refereeDashboard/MyGames";
import Performance from "./Performance";

export default function CampDetailsPage() {
    const [queryParams] = useSearchParams();
    const tab = queryParams.get("tab");
    console.log("tab", tab);
  return (
    <section className="w-full mt-7 mb-18">
      <div className="md:flex items-center justify-between container px-4">
        <ActiveCmpsBackBtn label="Active Camps" />
        <CampDetailsTabs />
      </div>
      <Divider className="my-6" />
      <div className="container px-4">
        {tab === "camp-details" && <CampDetails />}
        {tab === "roster" && <div>Roster comming soon</div>}
        {tab === "performance" && <Performance />}
        {tab === "my-games" && <MyGames />}
      </div>
    </section>
  );
}
