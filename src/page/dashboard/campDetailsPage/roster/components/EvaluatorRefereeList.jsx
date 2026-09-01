import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { LuMail, LuPhone, LuUser } from "react-icons/lu";
import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import RefereeDetailsModal from "@/page/dashboard/director-dashboard/roster/components/RefereeDetailsModal";
import { formatRefereePosition } from "@/utils/refereePositions";

const formatPhone = (phone) => {
  if (!phone) return "N/A";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return digits.length === 0 ? "N/A" : digits;
  }
  const areaCode = digits.slice(0, 3);
  const part1 = digits.slice(3, 6);
  const part2 = digits.slice(6, 10);
  return `(${areaCode}) ${part1}-${part2}`;
};

const EvaluatorRefereeList = ({ camp_id }) => {
  const { data: campDetails, isLoading } = useCampRosterDetails(camp_id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allMembers = useMemo(() => {
    const referees = campDetails?.referees || [];
    return referees.map((r) => ({ ...r, role: "Referee", status: r.status }));
  }, [campDetails?.referees]);

  // Client-side search filter
  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allMembers;
    return allMembers.filter((member) => {
      return (
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.id?.toString().includes(query) ||
        member.position?.toLowerCase().includes(query) ||
        member.phone?.toString().includes(query)
      );
    });
  }, [allMembers, searchQuery]);

  const handleCardClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Camp Referees
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({allMembers.length} total)
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Registered officials participating in camp games and evaluations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search referees by name, email, jersey..."
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

      {/* ── Grid of Cards / Loading / Empty ────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00AEEF] rounded-full animate-spin" />
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleCardClick(member)}
              className="group bg-white rounded-xl border border-[#E8E8E8] shadow-xs hover:shadow-md hover:border-[#00AEEF]/50 p-5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden cursor-pointer"
            >
              {/* Radial Cyan Glow Hover Effect */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.25),rgba(0,175,239,0.08),transparent_70%)] z-0" />

              {/* Content */}
              <div className="relative z-10 w-full flex flex-col items-center">
                {/* Avatar Box */}
                <div className="relative mb-3.5 mt-1">
                  <img
                    src={member?.avatar || "/default-avatar.png"}
                    alt={member?.name || "Referee"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  {member?.jourcy_number && (
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-bold shadow-xs border border-white">
                      #{member.jourcy_number}
                    </div>
                  )}
                </div>

                {/* Name & Role Badge */}
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#00AEEF] transition-colors leading-snug line-clamp-1 mb-1">
                  {member?.name || "Unnamed Official"}
                </h3>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-4">
                  <LuUser className="text-xs" />
                  <span>
                    {member?.position ? formatRefereePosition(member.position) : "Referee"}
                  </span>
                </span>

                {/* Contact Info */}
                <div className="w-full pt-3 border-t border-[#E8E8E8] space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-center gap-2 truncate">
                    <LuMail className="text-slate-400 text-sm shrink-0" />
                    <span className="truncate">{member?.email || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 truncate">
                    <LuPhone className="text-slate-400 text-sm shrink-0" />
                    <span className="tracking-wide font-medium">
                      {member?.phone ? formatPhone(member.phone) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-base text-gray-500 font-medium">
            {searchQuery
              ? `No referees match "${searchQuery}".`
              : "No referees registered for this camp."}
          </p>
        </div>
      )}

      {/* ── Referee Details Modal ─────────────────────────────── */}
      <RefereeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        referee={selectedMember}
      />
    </div>
  );
};

export default EvaluatorRefereeList;
