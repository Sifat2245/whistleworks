import { FiAward, FiCheckCircle } from "react-icons/fi";

const RefereeHistoryCard = ({ referee }) => {
  if (!referee) return null;

  return (
    <div className="mt-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {referee.name}
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
              {referee.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {referee.certifiedLevel} • {referee.experienceYears} Years Active • {referee.campsAttended} Camps Attended
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl">
          <FiAward className="text-emerald-600 size-4" />
          <div className="text-right">
            <span className="text-sm font-black text-emerald-700 block leading-none">
              {referee.overallScore} / 10
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              Aggregate Rating
            </span>
          </div>
        </div>
      </div>

      {/* Mechanics & Skills Progress Bars */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
          Mechanics & Skill Breakdown
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1 text-slate-600">
              <span className="font-medium">Positioning & Floor Spacing</span>
              <span className="font-bold text-slate-900">{referee.stats.positioning}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${referee.stats.positioning}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 text-slate-600">
              <span className="font-medium">Rules & Foul Accuracy</span>
              <span className="font-bold text-slate-900">{referee.stats.foulAccuracy}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${referee.stats.foulAccuracy}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 text-slate-600">
              <span className="font-medium">Game Management & Decorum</span>
              <span className="font-bold text-slate-900">{referee.stats.gameManagement}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${referee.stats.gameManagement}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 text-slate-600">
              <span className="font-medium">Physical Fitness & Hustle</span>
              <span className="font-bold text-slate-900">{referee.stats.fitness}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${referee.stats.fitness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historical Evaluations */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
          Historical Evaluations on Record
        </p>
        <div className="space-y-2">
          {referee.history.map((h, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-extrabold text-[10px]">
                    {h.year}
                  </span>
                  <span>{h.camp}</span>
                </span>
                <span className="text-primary font-black text-sm">{h.score}/10</span>
              </div>
              <p className="text-slate-700 italic leading-relaxed">&ldquo;{h.notes}&rdquo;</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/50 text-[11px] text-slate-500">
                <span>Evaluated by: <strong className="text-slate-700">{h.evaluator}</strong></span>
                {h.strengths && (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <FiCheckCircle className="size-3" />
                    <span>Key Strength: {h.strengths[0]}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefereeHistoryCard;
