import { Link, useSearchParams } from "react-router-dom";
import { LuUserCheck, LuUsers, LuShieldCheck } from "react-icons/lu";

export default function RosterTabs({ activeSubTab }) {
  const [queryParams] = useSearchParams();
  const subTab = activeSubTab || queryParams.get("subTab") || "evaluator";

  const tabs = [
    {
      id: "evaluator",
      label: "Evaluators",
      icon: <LuUserCheck className="text-base shrink-0" />,
    },
    {
      id: "referee",
      label: "Referees",
      icon: <LuUsers className="text-base shrink-0" />,
    },
    {
      id: "crews",
      label: "Referee Crews",
      icon: <LuShieldCheck className="text-base shrink-0" />,
    },
  ];

  return (
    <div className="bg-white p-1.5 rounded-xl border border-[#E8E8E8] shadow-xs flex items-center gap-1.5">
      {tabs.map((tab) => {
        const isActive = subTab === tab.id;

        return (
          <Link
            key={tab.id}
            to={`?tab=roster&subTab=${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                ? "bg-[#00AEEF] text-white shadow-sm shadow-[#00AEEF]/30 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
