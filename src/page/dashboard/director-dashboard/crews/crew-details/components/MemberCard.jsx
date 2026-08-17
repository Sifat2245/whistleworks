import profile from "@/assets/dashboard/profile.png";
import Swal from "sweetalert2";
import { useRemoveMemberFromCrew } from "@/hooks/api/director-hooks/useCrews";
import { LuTrash2, LuMail, LuPhone } from "react-icons/lu";

const MemberCard = ({ member, crewId }) => {
  const removeMemberMutation = useRemoveMemberFromCrew(crewId);
  const crewPositions = JSON.parse(
    localStorage.getItem(`crew_positions_${crewId}`) || "{}"
  );
  const positionName = crewPositions[member.id] || member.position_name;

  const handleRemove = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "This member will be removed from the crew. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove member",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeMemberMutation.mutate(member.id);
      }
    });
  };

  return (
    <div className="relative group bg-white border border-border rounded-[10px] p-5 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center">
      {/* Remove Button - Top Right */}
      <button
        onClick={handleRemove}
        disabled={removeMemberMutation.isPending}
        className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 rounded-lg p-2 shadow-sm border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Remove member"
        aria-label={`Remove ${member?.name || "member"} from crew`}
      >
        {removeMemberMutation.isPending ? (
          <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
        ) : (
          <LuTrash2 className="w-4 h-4" />
        )}
      </button>

      {/* Avatar + Jersey badge */}
      <div className="relative">
        <img
          src={member?.avatar || profile}
          alt={member?.name || "Referee"}
          className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 shadow-md"
          onError={(e) => (e.target.src = profile)}
        />
        {member?.jersey_number && (
          <span className="absolute -bottom-1.5 right-0 min-w-6 h-6 px-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
            #{member.jersey_number}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="mt-4 font-semibold text-[#333] text-base line-clamp-1 w-full">
        {member?.name || "Unnamed Referee"}
      </h3>

      {positionName && (
        <span className="mt-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
          {positionName}
        </span>
      )}

      {/* Contact info */}
      <div className="mt-2.5 space-y-1.5 w-full text-left">
        <p className="flex items-center gap-2 text-xs text-[#666] min-w-0">
          <LuMail className="text-primary shrink-0" />
          <span className="truncate">{member?.email || "N/A"}</span>
        </p>
        {member?.phone && (
          <p className="flex items-center gap-2 text-xs text-[#666] min-w-0">
            <LuPhone className="text-primary shrink-0" />
            <span className="truncate">{member.phone}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
