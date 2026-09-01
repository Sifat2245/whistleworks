import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { LuShieldCheck, LuUsers, LuMail, LuPhone } from "react-icons/lu";
import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import { formatRefereePosition } from "@/utils/refereePositions";

const Crews = ({ camp_id }) => {
  const { data: campDetails, isLoading } = useCampRosterDetails(camp_id);
  const [searchQuery, setSearchQuery] = useState("");

  const crews = useMemo(() => campDetails?.crews || [], [campDetails]);

  const filteredCrews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return crews;
    return crews.filter((crew) => {
      const matchName = crew.name?.toLowerCase().includes(query);
      const matchMember = crew.members?.some(
        (m) =>
          m.name?.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query) ||
          m.position?.toLowerCase().includes(query)
      );
      return matchName || matchMember;
    });
  }, [crews, searchQuery]);

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Referee Crews
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({crews.length} total)
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Pre-assigned official referee units allocated for court games and assignments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crew or member..."
            className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00AEEF] focus:bg-white text-xs sm:text-sm placeholder-gray-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <ImCross className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Content Grid / Loading / Empty ────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00AEEF] rounded-full animate-spin" />
        </div>
      ) : filteredCrews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrews.map((crew) => (
            <div
              key={crew.id}
              className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Card Top Banner */}
              <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center text-base shrink-0">
                    <LuShieldCheck />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold truncate">
                    {crew.name}
                  </h4>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                  {crew.status || "Active"}
                </span>
              </div>

              {/* Members Section */}
              <div className="p-5 flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <LuUsers className="text-slate-400 text-sm" />
                    <span>Crew Roster</span>
                  </span>
                  <span>{crew.members?.length || 0} Officials</span>
                </div>

                <div className="space-y-2.5">
                  {crew.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors"
                    >
                      <img
                        src={member.avatar || "/default-avatar.png"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-xs shrink-0"
                        onError={(e) => {
                          e.target.src = "https://admin.whistleworks.org/default/profile.jpg";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {member.name}
                          </p>
                          {member.position && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#00AEEF] border border-blue-100 text-[10px] font-bold uppercase tracking-wider shrink-0">
                              {formatRefereePosition(member.position)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                          <LuMail className="text-slate-400 shrink-0" />
                          <span className="truncate">{member.email || "N/A"}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                            <LuPhone className="text-slate-400 shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-[#E8E8E8] text-right text-xs text-slate-500 font-medium">
                Total Assigned: {crew.members?.length || 0} Referees
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-base text-gray-500 font-medium">
            {searchQuery
              ? `No referee crews match "${searchQuery}".`
              : "No referee crews assigned to this camp yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Crews;