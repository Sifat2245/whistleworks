import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import { useParams, useSearchParams } from "react-router-dom";
import CampDetailsTabs from "@/page/dashboard/RefereeDashboard/components/CampDetailsTabs";
import EvolatorCampTabs from "@/page/dashboard/EvolatorDashboard/EvolatorCampTabs";
import { Divider, Result, Spin } from "antd";
import CampDetails from "@/page/dashboard/campDetailsPage/camp-details/CampDetails";
import MyGames from "@/page/dashboard/RefereeDashboard/my-games/MyGames";
import Performance from "../RefereeDashboard/performancePage/Performance";
import Roster from "./roster/Roster";
import RankingReport from "./ranking-report/RankingReport";
import Schedule from "../EvolatorDashboard/schedule/Schedule";
import { useAuth } from "@/hooks/useAuth";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import EvaluateV2 from "../EvolatorDashboard/evaluate-referee/EvaluateV2";

export default function CampDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data: campData, isLoading } = useGetCampDetails(id);
  const campName = campData?.camp_name;

  const refereeRegistrationStatus = campData?.referee_registration_status;
  const evaluatorRegistrationStatus = campData?.evaluator_registration_status;

  const tab = searchParams.get("tab") || "camp-details";
  const { userData } = useAuth();
  const userRole = userData?.role?.toLowerCase();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const pathname = window.location.pathname;
  const isEvaluator = userRole === "evaluator";
  const isReferee = userRole === "referee";

  const isRefereeRegistered = refereeRegistrationStatus !== null;
  const isEvaluatorRegistered = evaluatorRegistrationStatus === "approved";

  const allowedTabs = {
    common: ["camp-details"],
    evaluator: ["ranking-report", "evaluate", "schedule", "roster"],
    referee: ["performance", "my-games", "roster", "ranking-report"],
  };

  const isTabAllowed =
    allowedTabs.common.includes(tab) ||
    (isEvaluator &&
      isEvaluatorRegistered &&
      allowedTabs.evaluator.includes(tab)) ||
    (isReferee && isRefereeRegistered && allowedTabs.referee.includes(tab));

  // Specific denial reasons
  const isRefereeNotRegisteredDenial =
    isReferee && !isRefereeRegistered && allowedTabs.referee.includes(tab);

  const isEvaluatorNotRegisteredDenial =
    isEvaluator &&
    !isEvaluatorRegistered &&
    allowedTabs.evaluator.includes(tab);

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
                      You need to register as an evaluator for this camp to
                      access:
                    </p>
                    <ul className="text-left max-w-md mx-auto mb-6 list-disc pl-5">
                      {allowedTabs.evaluator.map((t) => {
                        if (t === "ranking-report")
                          return <li key={t}>Ranking Report</li>;
                        if (t === "evaluate")
                          return <li key={t}>Evaluate Referees</li>;
                        if (t === "schedule")
                          return <li key={t}>Camp Schedule</li>;
                        if (t === "roster") return <li key={t}>Camp Roster</li>;
                        return null;
                      })}
                    </ul>
                    <p className="mt-4 text-black">
                      Please complete your registration to view this
                      information.
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
                      You need to register for this camp to access the following
                      sections:
                    </p>
                    <ul className="text-left max-w-md mx-auto mt-4 list-disc pl-5">
                      {tab === "performance" && <li>Performance Report</li>}
                      {tab === "my-games" && <li>My Games Schedule</li>}
                      {tab === "roster" && <li>Camp Roster</li>}
                      {tab === "ranking-report" && <li>Ranking Report</li>}
                    </ul>
                    <p className="mt-6 text-black">
                      Please complete your registration to view this
                      information.
                    </p>
                  </>
                }
              />
            )}

            {/* General Access Denied (wrong role or no access) */}
            {!isEvaluatorNotRegisteredDenial &&
              !isRefereeNotRegisteredDenial && (
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

            {/* Roster: Available to both registered referees and evaluators */}
            {(isEvaluator && isEvaluatorRegistered) ||
            (isReferee && isRefereeRegistered)
              ? tab === "roster" && <Roster camp_id={id} />
              : null}

            {/* Ranking Report: Available to BOTH registered evaluators AND registered referees */}
            {(isEvaluator && isEvaluatorRegistered) ||
            (isReferee && isRefereeRegistered)
              ? tab === "ranking-report" && (
                  <RankingReport camp_id={id} campName={campName} />
                )
              : null}

            {/* Evaluator-Only Tabs */}
            {isEvaluator && isEvaluatorRegistered && (
              <>
                {tab === "evaluate" && (
                  <EvaluateV2 camp_id={id} campName={campName} />
                )}
                {tab === "schedule" && (
                  <Schedule camp_id={id} campName={campName} />
                )}
              </>
            )}

            {/* Referee-Only Tabs */}
            {isReferee && isRefereeRegistered && (
              <>
                {tab === "performance" && <Performance camp_id={id} />}
                {tab === "my-games" && <MyGames camp_id={id} />}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
