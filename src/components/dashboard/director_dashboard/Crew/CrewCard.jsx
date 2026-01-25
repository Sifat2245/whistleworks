import { useNavigate } from "react-router-dom";

const CrewCard = ({ group }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/director-dashboard/crew-details/${group.id}`)}
      key={group.id}
      className="relative bg-white rounded-2xl border border-black/15 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Gradient header strip */}
      <div className="h-2 w-full bg-linear-to-r from-primary to-sky-600" />

      {/* Header */}
      <div className="p-6 pb-5 border-b border-black/15 bg-gray-50/60">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          {group.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {group.description || "No description provided."}
        </p>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold 
      ${
        group.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
        >
          {group.status}
        </span>
      </div>

      {/* Members Section */}
      <div className="p-6">
        {/* meta row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            👥 <span className="font-semibold">{group?.member_count}</span>{" "}
            Members
          </p>

          {group.member_count > 0 && (
            <span className="text-xs text-gray-400">
              Showing {group.members.length}
            </span>
          )}
        </div>

        {/* Empty state */}
        {group.members.length === 0 && (
          <div className="w-full py-6 bg-gray-50 border border-dashed rounded-xl text-center text-gray-400 text-sm">
            No members added yet
          </div>
        )}

        {/* Members list */}
        {group.members.length > 0 && (
          <div className="space-y-3 h-50 overflow-auto">
            {group.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-black/15 rounded-xl px-3 py-2 transition"
              >
                <img
                  src={m.avatar}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {m.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {m.role || "Crew Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewCard;
