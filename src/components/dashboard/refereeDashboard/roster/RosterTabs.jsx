import { Link, useSearchParams } from "react-router-dom";

export default function RosterTabs() {
    const [queryParams] = useSearchParams();
    const subTab = queryParams.get("subTab");
    console.log("subTab", subTab);
  return (
    <div className="bg-[#F5F5F5] p-3 rounded-2xl w-fit flex items-center gap-3">
      <Link
        to={`?tab=roster&subTab=evaluator`}
        className={`text[14px] px-1.5 py-2 ${subTab === "evaluator" ? "bg-primary text-white rounded-md" : ""}`}
      >
        Evaluator
      </Link>
      <Link
        to={`?tab=roster&subTab=referee`}
        className={`text[14px] px-1.5 py-2 ${subTab === "referee" ? "bg-primary text-white rounded-md" : ""}`}
      >
        Referee
      </Link>
      <Link
        to={`?tab=roster&subTab=crews`}
        className={`text[14px] px-1.5 py-2 ${subTab === "crews" ? "bg-primary text-white rounded-md" : ""}`}
      >
        Crews
      </Link>
    </div>
  );
}
