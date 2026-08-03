import Icon from "@/components/common/Icon";
import capmDetails from "@/assets/svg/camps-details.svg";
import singleUser from "/referee/single-user-icon.svg";
import craveArrow from "@/assets/svg/creve-arrow.svg";
import myGame from "@/assets/svg/my-games.svg";
import { Link, useSearchParams } from "react-router-dom";

const ALL_TABS = ["camp-details", "roster", "performance", "my-games", "ranking-report"];

export default function CampDetailsTabs({ visibleTabs = ALL_TABS }) {
  const [queryParams] = useSearchParams();
  const tab = queryParams.get("tab");
  const show = (key) => visibleTabs.includes(key);

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0">
      {show("camp-details") && (
        <Link
          to={`?tab=camp-details`}
          className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer w-44 ${
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
      )}

      {show("roster") && (
        <Link
          to={`?tab=roster&subTab=evaluator`}
          className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer w-44 ${
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
      )}

      {show("performance") && (
        <Link
          to={`?tab=performance`}
          className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer w-44 ${
            tab === "performance" ? "bg-primary" : ""
          }`}
        >
          <Icon
            src={craveArrow}
            alt="camp details icon"
            className={`${tab === "performance" && "text-white"} size-5`}
          />
          <span
            className={`text-base font-medium ${
              tab === "performance" && "text-white"
            }`}
          >
            Performance
          </span>
        </Link>
      )}

      {show("my-games") && (
        <Link
          to={`?tab=my-games`}
          className={`border border-border py-3 px-3 rounded-lg flex items-center gap-2 cursor-pointer w-44 ${
            tab === "my-games" ? "bg-primary" : ""
          }`}
        >
          <Icon
            src={myGame}
            alt="camp details icon"
            className={`${tab === "my-games" && "text-white"} size-5`}
          />
          <span
            className={`text-base font-medium whitespace-nowrap ${
              tab === "my-games" && "text-white"
            }`}
          >
            My Games
          </span>
        </Link>
      )}

      {show("ranking-report") && (
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
      )}
    </div>
  );
}
