import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import {
  useLoaderData,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
  const evaluatorRegistrationStatus = campData?.evaluator_registration_status;

  const tab = searchParams.get("tab") || "camp-details";
  const { userData } = useAuth();
  const userRole = userData?.role?.toLowerCase();

  const pathname = window.location.pathname;
  const isEvaluator = userRole === "evaluator";
  const isReferee = userRole === "referee";

  const isRefereeRegistered = refereeRegistrationStatus !== null;
  const isEvaluatorRegistered = evaluatorRegistrationStatus !== null;

  // Define allowed tabs by role
  const allowedTabs = {
    common: ["camp-details"],
    evaluator: ["ranking-report", "evaluate", "schedule", "roster"],
    referee: ["performance", "my-games", "roster"],
  };

  // Determine if current tab is allowed
  const isTabAllowed =
    allowedTabs.common.includes(tab) ||
    (isEvaluator && isEvaluatorRegistered && allowedTabs.evaluator.includes(tab)) ||
    (isReferee && isRefereeRegistered && allowedTabs.referee.includes(tab));

  // Specific denial reasons
  const isRefereeNotRegisteredDenial =
    isReferee && !isRefereeRegistered && allowedTabs.referee.includes(tab);

  const isEvaluatorNotRegisteredDenial =
    isEvaluator && !isEvaluatorRegistered && allowedTabs.evaluator.includes(tab);

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
          <>
            {/* Evaluator: Not registered */}
            {isEvaluatorNotRegisteredDenial && (
              <Result
                status="info"
                title="Registration Required"
                subTitle={
                  <div className="text-center">
                    <p className="mb-4">
                      You need to register as an evaluator for this camp to access:
                    </p>
                    <ul className="text-left max-w-md mx-auto mb-6 list-disc pl-5">
                      {tab === "ranking-report" && <li>Ranking Report</li>}
                      {tab === "evaluate" && <li>Evaluate Referees</li>}
                      {tab === "schedule" && <li>Camp Schedule</li>}
                      {tab === "roster" && <li>Camp Roster</li>}
                      {/* Show all if trying to access any restricted tab */}
                      {allowedTabs.evaluator.includes(tab) && tab !== "roster" && tab !== "ranking-report" && tab !== "evaluate" && tab !== "schedule" && (
                        <>
                          <li>Ranking Report</li>
                          <li>Evaluate Referees</li>
                          <li>Camp Schedule</li>
                          <li>Camp Roster</li>
                        </>
                      )}
                    </ul>
                    <p className="mt-4 text-black">
                      Please complete your registration to view this information.
                    </p>
                  </div>
                }
              />
            )}

            {/* Referee: Not registered */}
            {isRefereeNotRegisteredDenial && (
              <Result
                status="info"
                title="Registration Required"
                subTitle={
                  <>
                    <p>
                      You need to register for this camp to access the following sections:
                    </p>
                    <ul className="text-left max-w-md mx-auto mt-4">
                      {tab === "performance" && <li>• Performance Report</li>}
                      {tab === "my-games" && <li>• My Games Schedule</li>}
                      {tab === "roster" && <li>• Camp Roster</li>}
                    </ul>
                    <p className="mt-4 text-black">
                      Please complete your registration to view this information.
                    </p>
                  </>
                }
              />
            )}

            {/* General Access Denied (wrong role entirely) */}
            {!isEvaluatorNotRegisteredDenial && !isRefereeNotRegisteredDenial && (
              <Result
                status="403"
                title="Access Denied"
                subTitle="You don't have permission to view this tab."
              />
            )}
          </>
        ) : (
          <>
            {/* Common Tab */}
            {tab === "camp-details" && <CampDetails campData={campData} />}

            {/* Roster: Only for registered referees OR registered evaluators */}
            {(isEvaluator && isEvaluatorRegistered) ||
            (isReferee && isRefereeRegistered) ? (
              tab === "roster" && <Roster camp_id={id} />
            ) : null}

            {/* Evaluator Only Tabs - Require Registration */}
            {isEvaluator && isEvaluatorRegistered && (
              <>
                {tab === "ranking-report" && <RankingReport camp_id={id} />}
                {tab === "evaluate" && <EvaluateV2 camp_id={id} />}
                {tab === "schedule" && <Schedule camp_id={id} />}
              </>
            )}

            {/* Referee Only Tabs - Require Registration */}
            {isReferee && isRefereeRegistered && (
              <>
                {tab === "performance" && <Performance camp_id={id} />}
                {tab === "my-games" && <MyGames />}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}