import { useNavigate } from "react-router-dom";
import { LuUsers, LuArrowRight, LuShieldCheck, LuClock } from "react-icons/lu";
import { cn } from "@/lib/utils";

const CrewCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/director-dashboard/crew-details/${group.id}`)}
      key={group.id}
      className="relative bg-white rounded-[10px] border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Gradient header strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-primary to-sky-600" />

      {/* Header */}
      <div className="p-5 pb-4 border-b border-border bg-[#FAFAFA]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#333] leading-tight line-clamp-1">
            {group.name}
          </h3>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0",
              group.status === "active"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-amber-50 text-amber-700 border border-amber-200",
            )}
          >
            {group.status === "active" ? (
              <LuShieldCheck className="w-3 h-3" />
            ) : (
              <LuClock className="w-3 h-3" />
            )}
            {group.status}
          </span>
        </div>

        <p className="text-sm text-[#666] mt-1.5 line-clamp-2">
          {group.description || "No description provided."}
        </p>
      </div>

      {/* Members Section */}
      <div className="p-5">
        {/* meta row */}
        <div className="flex items-center justify-between mb-3">
          <p className="flex items-center gap-1.5 text-sm text-[#666]">
            <LuUsers className="text-primary" />
            <span className="font-semibold text-[#333]">
              {group?.member_count}
            </span>
            Members
          </p>

          {group.member_count > 0 && (
            <span className="text-xs text-[#999]">
              Showing {group.members.length}
            </span>
          )}
        </div>

        {/* Empty state */}
        {group.members.length === 0 && (
          <div className="w-full py-5 bg-[#FAFAFA] border border-dashed border-border rounded-[10px] text-center text-gray-400 text-sm">
            No members added yet
          </div>
        )}

        {/* Members list */}
        {group.members.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-auto hide-scrollbar">
            {group.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 bg-[#FAFAFA] hover:bg-primary/[0.03] border border-border rounded-[10px] px-3 py-2 transition"
              >
                <img
                  src={m.avatar || "/default-avatar.png"}
                  alt={m.name}
                  className="w-9 h-9 rounded-full object-cover border border-primary/20 shrink-0"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#333] truncate">
                    {m.name} {m.jersey_number ? `#${m.jersey_number}` : ""}
                  </p>
                  <p className="text-xs text-[#666] truncate">
                    {m.role || "Crew Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View link */}
        <div className="mt-4 flex items-center justify-end text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1.5">
            View Crew <LuArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CrewCard;
