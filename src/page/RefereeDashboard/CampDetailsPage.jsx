import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom";
import CampDetailsTabs from "@/components/dashboard/refereeDashboard/CampDetailsTabs";
import EvolatorCampTabs from "@/components/dashboard/evaluatorDashboard/ActiveCamps/EvolatorCampTabs";
import { Divider, Result } from "antd";
import CampDetails from "@/components/dashboard/refereeDashboard/CampDetails";
import MyGames from "@/components/dashboard/refereeDashboard/MyGames";
import Performance from "./Performance";
import Roster from "./Roster";
import RankingReport from "../EvolatorDashboard/RankingReport";
import Schedule from "../EvolatorDashboard/Schedule";
import { useAuth } from "@/hooks/useAuth";
import EvaluateV2 from "../EvolatorDashboard/EvaluateV2";

export default function CampDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const data = useLoaderData();
  const campData = data?.data?.data;

  const refereeRegistrationStatus = campData?.referee_registration_status;

  const tab = searchParams.get("tab") || "camp-details";
  const { userData } = useAuth();
  const userRole = userData?.role?.toLowerCase();

  const pathname = window.location.pathname;
  const isEvaluator = userRole === "evaluator";
  const isReferee = userRole === "referee";

  // Check if referee is registered for this camp
  const isRefereeRegistered = refereeRegistrationStatus !== null;

  // Define allowed tabs
  const allowedTabs = {
    common: ["camp-details"],
    evaluator: ["ranking-report", "evaluate", "schedule", "roster"],
  };

  const refereeAllowedTabs = isRefereeRegistered
    ? ["performance", "my-games", "roster"]
    : [];

  // Determine if current tab is allowed
  const isTabAllowed =
    allowedTabs.common.includes(tab) ||
    (isEvaluator && allowedTabs.evaluator.includes(tab)) ||
    (isReferee && refereeAllowedTabs.includes(tab));

  // Helper: Check if the denied access is because referee is not registered
  const isRefereeNotRegisteredDenial =
    isReferee && !isRefereeRegistered && refereeAllowedTabs.concat("performance", "my-games", "roster" ).includes(tab);

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
        {!isTabAllowed ? (
          // Custom message for unregistered referees
          isRefereeNotRegisteredDenial ? (
            <Result
              status="info"
              title="Registration Required"
              subTitle={
                <>
                  <p>You need to register for this camp to access the following sections:</p>
                  <ul className="text-left max-w-md mx-auto mt-4">
                    {tab === "performance" && <li>• Performance Report</li>}
                    {tab === "my-games" && <li>• My Games Schedule</li>}
                    {tab === "roster" && <li>• Camp Roster</li>}
                  </ul>
                  <p className="mt-4 text-black">Please complete your registration to view this information.</p>
                </>
              }
            />
          ) : (
            // Fallback for other unauthorized access (e.g. wrong role)
            <Result
              status="403"
              title="Access Denied"
              subTitle="You don't have permission to view this tab."
            />
          )
        ) : (
          <>
            {/* Common Tabs */}
            {tab === "camp-details" && <CampDetails campData={campData} />}

            {/* Roster: visible to evaluators always, and registered referees */}
            {(isEvaluator || (isReferee && isRefereeRegistered)) && tab === "roster" && (
              <Roster camp_id={id} />
            )}

            {/* Evaluator Only Tabs */}
            {isEvaluator && tab === "ranking-report" && <RankingReport camp_id={id} />}
            {isEvaluator && tab === "evaluate" && <EvaluateV2 camp_id={id} />}
            {isEvaluator && tab === "schedule" && <Schedule camp_id={id} />}

            {/* Referee Only Tabs - Only if registered */}
            {isReferee && isRefereeRegistered && tab === "performance" && <Performance />}
            {isReferee && isRefereeRegistered && tab === "my-games" && <MyGames />}
          </>
        )}
      </div>
    </section>
  );
}