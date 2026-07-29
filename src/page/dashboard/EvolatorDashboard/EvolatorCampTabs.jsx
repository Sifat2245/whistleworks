import Icon from "@/components/common/Icon";
import { Link, useSearchParams } from "react-router-dom";
import capmDetails from "@/assets/svg/camps-details.svg";
import singleUser from "/referee/single-user-icon.svg";
import craveArrow from "@/assets/svg/creve-arrow.svg";
import myGame from "@/assets/svg/my-games.svg";
import calender from "/referee/calender-icon.svg";

export default function EvolatorCampTabs() {
  const [queryParams] = useSearchParams();
  const tab = queryParams.get("tab");
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0">
      <Link
        to={`?tab=camp-details`}
        className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer ${
          tab === "camp-details" ? "bg-primary" : ""
        }`}
      >
        <Icon
          src={capmDetails}
          alt="camp details icon"
          className={`${tab === "camp-details" && "text-white"} size-5`}
        />
        <span
          className={`text-base font-medium whitespace-nowrap ${
            tab === "camp-details" && "text-white"
          }`}
        >
          Camp Details
        </span>
      </Link>
      <Link
        to={`?tab=roster&subTab=evaluator`}
        className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer ${
          tab === "roster" ? "bg-primary" : ""
        }`}
      >
        <Icon
          src={singleUser}
          alt="camp details icon"
          className={`${tab === "roster" && "text-white"} size-5`}
        />
        <span
          className={`text-base font-medium ${
            tab === "roster" && "text-white"
          }`}
        >
          Roster
        </span>
      </Link>
      <Link
        to={`?tab=schedule`}
        className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer ${
          tab === "schedule" ? "bg-primary" : ""
        }`}
      >
        <Icon
          src={calender}
          alt="camp details icon"
          className={`${tab === "schedule" && "text-white"} size-5`}
        />
        <span
          className={`text-base font-medium ${
            tab === "schedule" && "text-white"
          }`}
        >
          Schedule
        </span>
      </Link>
      <Link
        to={`?tab=evaluate`}
        className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer ${
          tab === "evaluate" ? "bg-primary" : ""
        }`}
      >
        <Icon
          src={craveArrow}
          alt="camp details icon"
          className={`${tab === "evaluate" && "text-white"} size-5`}
        />
        <span
          className={`text-base font-medium ${
            tab === "evaluate" && "text-white"
          }`}
        >
          Evaluate
        </span>
      </Link>
      <Link
        to={`?tab=ranking-report`}
        className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer ${
          tab === "ranking-report" ? "bg-primary" : ""
        }`}
      >
        <Icon
          src={myGame}
          alt="camp details icon"
          className={`${tab === "ranking-report" && "text-white"} size-5`}
        />
        <span
          className={`text-base font-medium whitespace-nowrap ${
            tab === "ranking-report" && "text-white"
          }`}
        >
          Ranking Report
        </span>
      </Link>
    </div>
  );
}
