import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom"; // Note: You're using React Router v6? If Next.js, use next/navigation instead
import CampDetailsTabs from "@/components/dashboard/refereeDashboard/CampDetailsTabs";
import EvolatorCampTabs from "@/components/dashboard/evaluatorDashboard/ActiveCamps/EvolatorCampTabs";
import { Divider, Result } from "antd";
import CampDetails from "@/components/dashboard/refereeDashboard/CampDetails";
import MyGames from "@/components/dashboard/refereeDashboard/MyGames";
import Performance from "./Performance";
import Roster from "./Roster";
import RankingReport from "../EvolatorDashboard/RankingReport";
import Schedule from "../EvolatorDashboard/Schedule";
import Evaluate from "../DirectorDashboard/Evaluate"; // Note: This is from DirectorDashboard — is that correct?
import { useAuth } from "@/hooks/useAuth";

export default function CampDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const data = useLoaderData();
  const campData = data?.data?.data

  const tab = searchParams.get("tab") || "camp-details";
  const { userData } = useAuth();
  const userRole = userData?.role?.toLowerCase();

  const pathname = window.location.pathname;
  const isEvaluator = userRole === "evaluator";
  const isReferee = userRole === "referee";

  // Define allowed tabs per role
  const allowedTabs = {
    common: ["camp-details", "roster"],
    evaluator: ["ranking-report", "evaluate", "schedule"],
    referee: ["performance", "my-games"],
  };

  // Check if current tab is allowed for the user
  const isTabAllowed =
    allowedTabs.common.includes(tab) ||
    (isEvaluator && allowedTabs.evaluator.includes(tab)) ||
    (isReferee && allowedTabs.referee.includes(tab));


  return (
    <section className="w-full mt-7 mb-18">
      <div className="md:flex items-center justify-between container px-4">
        <ActiveCmpsBackBtn label="Active Camps" />
        {pathname.includes("evaluator-dashboard") ? (
          <EvolatorCampTabs />
        ) : (
          <CampDetailsTabs />
        )}
      </div>
      <Divider className="my-6" />

      <div className="container px-4">
        {/* Unauthorized Tab Access */}
        {!isTabAllowed ? (
          <Result
            status="403"
            title="Access Denied"
            subTitle="You don't have permission to view this tab."
          />
        ) : (
          <>
            {/* Common Tabs - Both Roles */}
            {tab === "camp-details" && <CampDetails campData={campData} />}
            {tab === "roster" && <Roster />}

            {/* Evaluator Only Tabs */}
            {isEvaluator && tab === "ranking-report" && <RankingReport />}
            {isEvaluator && tab === "evaluate" && <Evaluate camp_id={id}/>}
            {isEvaluator && tab === "schedule" && <Schedule />}

            {/* Referee Only Tabs */}
            {isReferee && tab === "performance" && <Performance />}
            {isReferee && tab === "my-games" && <MyGames />}
          </>
        )}
      </div>
    </section>
  );
}