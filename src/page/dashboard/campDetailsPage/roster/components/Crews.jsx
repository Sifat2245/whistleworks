import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";

const Crews = ({ camp_id }) => {
  const { data: campDetails, isLoading } = useCampRosterDetails(camp_id);

  const crews = campDetails?.crews || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (crews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No crews found for this camp.
      </div>
    );
  }

  return (
    <div className="space-y-8 px-2 md:px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Referee Crews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crews.map((crew) => (
          <div
            key={crew.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header */}
            <div className="bg-primary px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                 {crew.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {crew.status}
                </span>
              </div>
            </div>

            {/* Members */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Crew Members ({crew.members.length})
              </h4>

              <div className="space-y-4">
                {crew.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.src = "https://admin.whistleworks.org/default/profile.jpg";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {member.email}
                      </p>
                      {member.phone && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
              <span className="text-sm text-gray-500">
                {crew.members.length} member{crew.members.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crews;