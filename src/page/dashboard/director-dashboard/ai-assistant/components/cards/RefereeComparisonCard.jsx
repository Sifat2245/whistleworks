import { LuSparkles } from "react-icons/lu";

const RefereeComparisonCard = ({ title, refA, refB, verdict }) => {
  if (!refA || !refB) return null;

  return (
    <div className="mt-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-2.5">
        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
          {title || `Head-to-Head: ${refA.name} vs ${refB.name}`}
        </h4>
        <p className="text-xs text-slate-500 font-medium">
          Multi-camp metric comparison across evaluated assignments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* Official A */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Official A
              </span>
              <p className="font-extrabold text-blue-950 text-base mt-1">{refA.name}</p>
              <p className="text-[11px] text-blue-800/80 font-medium">{refA.certifiedLevel}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-700">{refA.overallScore}</span>
              <span className="text-[10px] text-blue-600 block font-bold uppercase">/10 Rating</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-blue-200/60 text-slate-700">
            <div className="flex justify-between">
              <span>Experience:</span>
              <span className="font-bold text-slate-900">{refA.experienceYears} Years</span>
            </div>
            <div className="flex justify-between">
              <span>Camps Attended:</span>
              <span className="font-bold text-slate-900">{refA.campsAttended} Camps</span>
            </div>
            <div className="flex justify-between">
              <span>Positioning:</span>
              <span className="font-bold text-blue-700">{refA.stats.positioning}%</span>
            </div>
            <div className="flex justify-between">
              <span>Foul Accuracy:</span>
              <span className="font-bold text-blue-700">{refA.stats.foulAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Rules Knowledge:</span>
              <span className="font-bold text-blue-700">{refA.stats.rulesKnowledge}%</span>
            </div>
          </div>
        </div>

        {/* Official B */}
        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                Official B
              </span>
              <p className="font-extrabold text-purple-950 text-base mt-1">{refB.name}</p>
              <p className="text-[11px] text-purple-800/80 font-medium">{refB.certifiedLevel}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-purple-700">{refB.overallScore}</span>
              <span className="text-[10px] text-purple-600 block font-bold uppercase">/10 Rating</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-purple-200/60 text-slate-700">
            <div className="flex justify-between">
              <span>Experience:</span>
              <span className="font-bold text-slate-900">{refB.experienceYears} Years</span>
            </div>
            <div className="flex justify-between">
              <span>Camps Attended:</span>
              <span className="font-bold text-slate-900">{refB.campsAttended} Camps</span>
            </div>
            <div className="flex justify-between">
              <span>Positioning:</span>
              <span className="font-bold text-purple-700">{refB.stats.positioning}%</span>
            </div>
            <div className="flex justify-between">
              <span>Foul Accuracy:</span>
              <span className="font-bold text-purple-700">{refB.stats.foulAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Rules Knowledge:</span>
              <span className="font-bold text-purple-700">{refB.stats.rulesKnowledge}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      {verdict && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
            <LuSparkles className="size-3.5" />
            <span>AI Matchup Insight & Guidance:</span>
          </div>
          <p className="text-slate-200">{verdict.replace(/\*\*/g, "")}</p>
        </div>
      )}
    </div>
  );
};

export default RefereeComparisonCard;
