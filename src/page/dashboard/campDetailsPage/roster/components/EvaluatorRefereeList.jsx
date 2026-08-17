import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { Avatar, Card } from "antd";
import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import RefereeDetailsModal from "@/page/dashboard/director-dashboard/roster/components/RefereeDetailsModal";

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
        member.id.toString().includes(query) ||
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

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">
        Referees ({allMembers.length})
      </h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, phone, or ID..."
          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 text-sm placeholder-gray-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <ImCross className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-gray-500">
          {searchQuery ? "No referees match your search." : "No team members found"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              hoverable
              className="group relative overflow-hidden rounded-xl border border-black/10 shadow-sm transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick(member)}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]" />

              <div className="relative z-10 flex flex-col items-center text-center gap-3 p-4">
                <Avatar
                  size={80}
                  src={member?.avatar || "/default-avatar.png"}
                  alt={member?.name || "Member"}
                />

                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-black">
                    {member?.name || "Unnamed Member"}{" "}
                    {member?.jourcy_number && `#${member.jourcy_number}`}
                  </h3>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-[#444]">Email:</span>{" "}
                    {member?.email || "N/A"}
                  </p>

                  {member?.phone && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-[#444]">Phone:</span>{" "}
                      <span className="tracking-wide font-medium">
                        {formatPhone(member.phone)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Referee Details Modal - Same design as evaluator modal */}
      <RefereeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        referee={selectedMember}
      />
    </div>
  );
};

export default EvaluatorRefereeList;
