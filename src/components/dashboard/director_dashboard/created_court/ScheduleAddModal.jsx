// ScheduleAddModal.jsx
import { useState, useEffect, useMemo } from "react";
import { Modal, Input, Tabs, Radio, Spin } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { BiSearch } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { ImBlocked } from "react-icons/im";
import Swal from "sweetalert2";

const { Search } = Input;
const { TabPane } = Tabs;

const ScheduleAddModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  handleBlockCourt,
  onAssignSuccess,
  campId,
  selectedDate,
  maxReferees = 2,
}) => {
  const [activeTab, setActiveTab] = useState("referees");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Reset state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setSelectedReferees([]);
      setSelectedCrew(null);
      setSearchTerm("");
      setActiveTab("referees");
    }
  }, [isModalOpen]);

  // Individual Referees Query
  const { data: refereeListData = [], isLoading: loadingReferees } = useQuery({
    queryKey: ["referee-list", campId, selectedCourt?.slot_id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/available-referees-with-time-check`
      );
      return res?.data?.data?.referees || [];
    },
    enabled:
      !!campId &&
      isModalOpen &&
      !!selectedCourt?.slot_id &&
      activeTab === "referees",
  });

  // Crew List Query
  const { data: crewListData = [], isLoading: loadingCrews } = useQuery({
    queryKey: ["crew-list", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/camp/${campId}/crews`);
      return res?.data?.data?.crews || [];
    },
    enabled: !!campId && isModalOpen,
  });

  // Pre-select currently assigned referees
  useEffect(() => {
    if (activeTab === "referees" && refereeListData.length > 0) {
      const preSelected = refereeListData.filter(
        (ref) => ref.is_assigned_to_this_slot
      );
      setSelectedReferees(preSelected);
    }
  }, [refereeListData, activeTab]);

  // Search filter
  const filteredReferees = useMemo(() => {
    if (!searchTerm || activeTab !== "referees") return refereeListData;
    return refereeListData.filter((ref) =>
      ref.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [refereeListData, searchTerm, activeTab]);

  // Toggle referee
  const handleRefereeToggle = (referee) => {
    if (hasCrewAssigned) {
      toast.warning("Cannot modify — a crew is already assigned");
      return;
    }

    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= maxReferees) {
        toast.warning(`Maximum ${maxReferees} referees can be assigned`);
        return prev;
      }
      return [...prev, referee];
    });
  };

  // Mutations
  const assignRefereeMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      selectedReferees.forEach((ref) =>
        formData.append("referee_ids[]", ref.id)
      );
      const res = await axiosInstance.post(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/assign-individual`,
        formData
      );
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Referees assigned successfully");
      onAssignSuccess();
    },
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.data ||
        error?.response?.data?.message ||
        "Failed to assign referees";

      // Special handling for crew conflict
      if (
        backendMessage.includes("crew") ||
        backendMessage.includes("Remove crew first")
      ) {
        Swal.fire({
          icon: "warning",
          title: "Crew Already Assigned",
          text: backendMessage,
          confirmButtonColor: "#00AEEF",
          confirmButtonText: "OK",
        });
      } else {
        toast.error(backendMessage);
      }
    },
  });

  const assignCrewMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/assign-crew`,
        { crew_id: selectedCrew }
      );
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Crew assigned successfully");
      onAssignSuccess();
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to assign crew";
      toast.error(msg);
    },
  });

  // Button logic
  const isRefereesTab = activeTab === "referees";

  // Detect current assignment conflicts 
  const hasIndividualReferees =
    (selectedCourt?.assignments && selectedCourt.assignments.length > 0) ||
    refereeListData?.some((ref) => ref.is_assigned_to_this_slot === true);

  const hasCrewAssigned = !!selectedCourt?.crew;

  // sometimes crew might be in assignments
  const hasCrewInAssignments = selectedCourt?.assignments?.some(
    (assignment) => assignment.is_crew || assignment.crew_id
  );

  const isConflictRefereesTab =
    activeTab === "referees" && (hasCrewAssigned || hasCrewInAssignments);
  const isConflictCrewTab = activeTab === "crew" && hasIndividualReferees;

  const primaryButtonDisabled =
    (isRefereesTab ? selectedReferees.length === 0 : !selectedCrew) ||
    isConflictRefereesTab ||
    isConflictCrewTab;

  const primaryButtonLoading = isRefereesTab
    ? assignRefereeMutation.isPending
    : assignCrewMutation.isPending;

  const primaryButtonText = () => {
    if (isConflictRefereesTab) return "Crew Already Assigned";
    if (isConflictCrewTab) return "Individuals Already Assigned";
    if (isRefereesTab)
      return `Assign Referees (${selectedReferees.length}/${maxReferees})`;
    return selectedCrew ? "Assign Selected Crew" : "Select a Crew";
  };

  const handlePrimaryAction = () => {
    if (isRefereesTab) {
      assignRefereeMutation.mutate();
    } else {
      assignCrewMutation.mutate();
    }
  };

  return (
    <Modal
      title={
        <div>
          <div className="text-lg font-semibold">
            Assign to Court {selectedCourt?.court_number}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {selectedTimeSlot?.time} • {selectedCourt?.location}
          </div>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={960}
      centered
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          if (key === "referees" && hasCrewAssigned) {
            Swal.fire({
              icon: "warning",
              title: "Cannot Assign Individual Referees",
              text: "This time slot already has a crew assigned. Remove the crew first.",
              confirmButtonColor: "#00AEEF",
            });
            return;
          }
          if (key === "crew" && hasIndividualReferees) {
            Swal.fire({
              icon: "warning",
              title: "Cannot Assign Crew",
              text: "This time slot already has individual referees assigned. Remove them first.",
              confirmButtonColor: "#00AEEF",
            });
            return;
          }
          setActiveTab(key);
        }}
        className="mt-4"
      >
        {/* Referees Tab */}
        <TabPane tab="Assign Referees" key="referees">
          <div className="mt-4 space-y-5">
            {hasCrewAssigned && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-300 rounded-lg text-orange-800 flex items-center gap-3">
                <ImBlocked className="text-xl" />
                <div>
                  <p className="font-medium">Crew Already Assigned</p>
                  <p className="text-sm">
                    You cannot assign individual referees when a crew is
                    assigned.
                  </p>
                </div>
              </div>
            )}

            <Search
              placeholder="Search referees by name..."
              allowClear
              size="large"
              prefix={<BiSearch className="text-gray-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              disabled={hasCrewAssigned}
            />

            <div className="flex justify-between items-center">
              <p className="font-medium">
                Available Referees ({filteredReferees.length})
              </p>
              <p className="text-sm font-semibold text-[#00AEEF]">
                Selected: {selectedReferees.length}/{maxReferees}
              </p>
            </div>

            <div className="max-h-[460px] overflow-y-auto space-y-3 pr-2">
              {loadingReferees ? (
                <div className="text-center py-12">
                  <Spin />
                </div>
              ) : filteredReferees.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm
                    ? "No referees match your search"
                    : "No available referees"}
                </div>
              ) : (
                filteredReferees.map((ref) => {
                  const isSelected = selectedReferees.some(
                    (r) => r.id === ref.id
                  );
                  const disabled =
                    !isSelected && selectedReferees.length >= maxReferees;

                  return (
                    <div
                      key={ref.id}
                      onClick={() =>
                        !disabled &&
                        !hasCrewAssigned &&
                        handleRefereeToggle(ref)
                      }
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all
                        ${
                          hasCrewAssigned
                            ? "opacity-60 cursor-not-allowed bg-gray-50"
                            : isSelected
                            ? "border-[#00AEEF] bg-blue-50 shadow-md"
                            : disabled
                            ? "bg-gray-50 opacity-60 cursor-not-allowed"
                            : "hover:border-[#00AEEF] hover:shadow-md border-gray-200 cursor-pointer"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ref.avatar || "/default-avatar.png"}
                          alt={ref.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) =>
                            (e.target.src = "/default-avatar.png")
                          }
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {ref.name || "Unnamed Referee"}
                            </p>
                            {ref.is_assigned_to_this_slot && (
                              <span className="text-xs bg-[#00AEEF]/10 text-[#00AEEF] px-2 py-1 rounded-full">
                                Currently Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{ref.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-5 h-5 text-[#00AEEF] rounded focus:ring-[#00AEEF]"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabPane>

        {/* Crew Tab */}
        <TabPane tab="Assign Crew" key="crew">
          <div className="mt-6">
            {hasIndividualReferees && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-300 rounded-lg text-orange-800 flex items-center gap-3">
                <ImBlocked className="text-xl" />
                <div>
                  <p className="font-medium">
                    Individual Referees Already Assigned
                  </p>
                  <p className="text-sm">
                    You cannot assign a crew when individuals are already
                    assigned.
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Select one pre-made crew to assign all its members to this time
              slot.
            </p>

            {loadingCrews ? (
              <div className="text-center py-16">
                <Spin size="large" />
              </div>
            ) : crewListData.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                No crews available for this camp.
              </div>
            ) : (
              <Radio.Group
                value={selectedCrew}
                onChange={(e) => setSelectedCrew(e.target.value)}
                className="w-full space-y-4 h-[460px] overflow-y-auto"
                disabled={hasIndividualReferees}
              >
                {crewListData.map((crew) => (
                  <div
                    key={crew.id}
                    onClick={() =>
                      !hasIndividualReferees &&
                      setSelectedCrew(selectedCrew === crew.id ? null : crew.id)
                    }
                    className={`
                      border-2 rounded-xl p-6 transition-all cursor-pointer
                      ${
                        hasIndividualReferees
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }
                      ${
                        selectedCrew === crew.id
                          ? "border-[#00AEEF] bg-blue-50 shadow-lg ring-2 ring-[#00AEEF]/20"
                          : "border-gray-200 hover:border-[#00AEEF] hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Radio
                          value={crew.id}
                          className="mt-1.5"
                          disabled={hasIndividualReferees}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg">{crew.name}</h4>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                                ${
                                  crew.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                            >
                              {crew.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {crew.member_count || crew.members?.length || 0}{" "}
                            members
                          </p>
                          <div className="flex flex-wrap gap-2 mt-5 -space-x-3">
                            {(crew.members || []).slice(0, 10).map((member) => (
                              <img
                                key={member.id}
                                src={member.avatar || "/default-avatar.png"}
                                alt={member.name}
                                title={member.name || "Referee"}
                                className="w-11 h-11 rounded-full border-3 border-white shadow-md object-cover"
                                onError={(e) =>
                                  (e.target.src = "/default-avatar.png")
                                }
                              />
                            ))}
                            {(crew.members || []).length > 10 && (
                              <div className="w-11 h-11 rounded-full bg-gray-200 border-3 border-white flex items-center justify-center text-sm font-bold text-gray-600 shadow-md">
                                +{crew.members.length - 10}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Radio.Group>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <CommonSubmitBtn variant="secondary" onClick={handleCloseModal}>
            Cancel
          </CommonSubmitBtn>
          <CommonSubmitBtn variant="danger" onClick={handleBlockCourt}>
            <ImBlocked className="mr-2" />
            Block Court
          </CommonSubmitBtn>
        </div>

        <CommonSubmitBtn
          onClick={handlePrimaryAction}
          disabled={primaryButtonDisabled}
          loading={primaryButtonLoading}
          variant="primary"
          className="min-w-[180px]"
        >
          {primaryButtonText()}
        </CommonSubmitBtn>
      </div>
    </Modal>
  );
};

export default ScheduleAddModal;
