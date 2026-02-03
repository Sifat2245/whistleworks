import { useState } from "react";
import { Avatar, Card, Modal, Descriptions } from "antd";
import useGetCampDetails from "@/hooks/get-camp-details";

const EvaluatorRefereeList = ({ camp_id }) => {
  const { campDetails, isLoading } = useGetCampDetails({ camp_id });
  const referees = campDetails?.referees || [];
  const evaluators = campDetails?.evaluators || [];

  const [selectedMember, setSelectedMember] = useState(null);

  const allMembers = [
    ...referees.map((r) => ({ ...r, role: "Referee", status: r.status })),
    ...evaluators.map((e) => ({
      ...e,
      role: "Evaluator",
      status: "registered",
    })),
  ];

  const handleCardClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    const digits = phone.replace(/\D/g, "");

    if (digits.length === 0) return "N/A";

    if (digits.length <= 6) {
      return digits;
    }

    let formatted = `(${digits.slice(0, 3)})`;

    const remaining = digits.slice(3);

    if (remaining.length > 0) {
      for (let i = 0; i < remaining.length; i += 3) {
        formatted += "-" + remaining.slice(i, i + 3);
      }
    }

    return formatted;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">
        Referees & Evaluators ({allMembers.length})
      </h1>

      {/* Grid */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : allMembers.length === 0 ? (
        <p className="text-center text-gray-500">No team members found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allMembers.map((member) => (
            <Card
              key={member.id}
              hoverable
              className="group relative overflow-hidden rounded-xl border border-black/10 shadow-sm transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick(member)}
            >
              {/* CENTER GRADIENT OVERLAY */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]" />

              <div className="relative z-10 flex flex-col items-center text-center gap-3 p-4">
                <Avatar
                  size={80}
                  src={member?.avatar || "/default-avatar.png"}
                  alt={member?.name || "Member"}
                />

                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-black">
                    {member?.name || "Unnamed Member"} {member?.jourcy_number && `(${member.jourcy_number})`}
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

      {/* Modal with full information */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Avatar size={48} src={selectedMember?.avatar} />
            <span>{selectedMember?.name || "Member Details"}</span>
          </div>
        }
        open={!!selectedMember}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        centered
      >
        {selectedMember && (
          <div className="py-6">
            <Descriptions
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
              size="middle"
            >
              <Descriptions.Item label="Full Name" span={2}>
                {selectedMember.name || "—"}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedMember.email || "Not provided"}
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                {formatPhone(selectedMember.phone)}
              </Descriptions.Item>

              <Descriptions.Item label="Address">
                {selectedMember.address || "Not provided"}
              </Descriptions.Item>

              {selectedMember.role === "Referee" && (
                <Descriptions.Item label="Assigned Games">
                  {selectedMember.assigned_games_count ?? "0"}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Biography" span={2}>
                {selectedMember.biography ? (
                  selectedMember.biography
                ) : (
                  <span className="text-gray-500 italic">
                    No biography provided
                  </span>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Jersey Number" span={2}>
                {selectedMember.jourcy_number || "—"}
              </Descriptions.Item>

              <Descriptions.Item label="Role">
                {selectedMember.role}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                {selectedMember.status === "checked_in"
                  ? "Checked In"
                  : selectedMember.status || "Registered"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvaluatorRefereeList;
