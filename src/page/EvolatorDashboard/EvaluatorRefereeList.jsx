import { Avatar, Card } from "antd";
import useGetCampDetails from "@/hooks/get-camp-details";

const EvaluatorRefereeList = ({ camp_id }) => {
  const { campDetails, isLoading } = useGetCampDetails({ camp_id });
  const referees = campDetails?.referees || [];
  const evaluators = campDetails?.evaluators || [];

  const allMembers = [
    ...referees.map(r => ({ ...r, role: 'Referee', status: r.status })),
    ...evaluators.map(e => ({ ...e, role: 'Evaluator', status: 'registered' }))
  ];

  // Note: main ui component
  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">
        Referees ({allMembers.length})
      </h1>

      {/* Grid */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : allMembers.length === 0 ? (
        <p className="text-center text-gray-500">
          No team members found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allMembers.map((member) => (
            <Card
              key={member.id}
              hoverable
              className="group relative overflow-hidden rounded-xl border border-black/10 shadow-sm transition-all duration-300"
            >
              {/* CENTER GRADIENT OVERLAY */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]" />

              <div className="relative z-10 flex flex-col items-center text-center gap-3 p-4">
                <Avatar size={80} src={member?.avatar} />

                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-black">
                    {member?.name}
                  </h3>

                  <div className="flex items-center gap-2 justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Evaluator' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {member.role}
                    </span>
                    {member.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'checked_in' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-[#444]">Email:</span> {member?.email}
                  </p>

                  {member?.phone && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-[#444]">Phone:</span> {member?.phone}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluatorRefereeList;