import { Card, Avatar } from "antd";
import profile from "@/assets/dashboard/profile.png";
import { BiX } from "react-icons/bi";
import Swal from "sweetalert2";
import { useRemoveMemberFromCrew } from "@/hooks/api/director-hooks/useCrews";

const MemberCard = ({ member, crewId }) => {
  const removeMemberMutation = useRemoveMemberFromCrew(crewId);

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
    <Card
      hoverable
      className="group relative overflow-hidden rounded-xl border border-black/10 shadow-sm transition-all duration-300"
    >
      {/* Gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]" />

      {/* Delete Button - Top Right */}
      <button
        onClick={handleRemove}
        disabled={removeMemberMutation.isPending}
        className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity 
                   bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg 
                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Remove member"
      >
        {removeMemberMutation.isPending ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <BiX className="w-4 h-4" />
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3 py-4">
        <Avatar size={80} src={member?.avatar || profile} />

        <div className="space-y-1 px-4 py-5">
          <h3 className="text-lg font-medium text-black">
            {member?.name || "Unnamed Referee"}{" "}
            {member?.jersey_number ? `#${member?.jersey_number}` : ""}
          </h3>

          <p className="text-sm text-gray-500 break-all">
            <span className="font-medium text-[#444]">Email:</span>{" "}
            {member?.email || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;
