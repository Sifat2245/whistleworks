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

  // === Individual Referees Query ===
  const { data: refereeListData = [], isLoading: loadingReferees } = useQuery({
    queryKey: ["referee-list", campId, selectedCourt?.slot_id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/available-referees-with-time-check`
      );
      return res?.data?.data?.available_referees || [];
    },
    enabled:
      !!campId &&
      isModalOpen &&
      !!selectedCourt?.slot_id &&
      activeTab === "referees",
  });

  // === Crew List Query ===
  const { data: crewListData = [], isLoading: loadingCrews } = useQuery({
    queryKey: ["crew-list", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/camp/${campId}/crews`);
      return res?.data?.data?.crews || [];
    },
    enabled: !!campId && isModalOpen,
  });

  // Pre-select currently assigned referees when data loads
  useEffect(() => {
    if (activeTab === "referees" && refereeListData.length > 0) {
      const preSelected = refereeListData.filter(
        (ref) => ref.is_assigned_to_this_slot
      );
      setSelectedReferees(preSelected);
    }
  }, [refereeListData, activeTab]);

  // Search filter for referees
  const filteredReferees = useMemo(() => {
    if (!searchTerm || activeTab !== "referees") return refereeListData;
    return refereeListData.filter((ref) =>
      ref.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [refereeListData, searchTerm, activeTab]);

  // Toggle referee selection (dynamic max based on maxReferees prop)
  const handleRefereeToggle = (referee) => {
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
    onSuccess: (data) => {
      if (data?.data?.assigned_referees?.length > 0) {
        toast.success("Referees assigned successfully");
        onAssignSuccess(selectedCourt.slot_id, data.data.assigned_referees);
        queryClient.invalidateQueries({
          queryKey: ["court-info", campId, selectedDate],
        });
        handleCloseModal();
      }
      if (data?.data?.errors?.length > 0) {
        data.data.errors.forEach((err) => toast.error(err));
      }
    },
    onError: (error) => {
      // Extract error message from backend
      const errorMessage =
        error?.response?.data?.data ||
        error?.response?.data?.message ||
        "Failed to assign referees";

      // Special case: crew already assigned
      if (errorMessage.includes("already assigned to a crew")) {
        Swal.fire({
          icon: "warning",
          title: "Crew Already Assigned",
          text: errorMessage,
          confirmButtonText: "OK",
          confirmButtonColor: "#00AEEF",
        });
      } else {
        toast.error(errorMessage);
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
    onSuccess: (data) => {
      toast.success(data.message || "Crew assigned successfully");
      onAssignSuccess(selectedCourt.slot_id, data.data.assigned_referees || []);
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
      handleCloseModal();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.data ||
        error?.response?.data?.message ||
        "Failed to assign crew";

      // You might also want to handle crew conflicts here (e.g. already has individuals)
      if (errorMessage.includes("crew") || errorMessage.includes("already")) {
        Swal.fire({
          icon: "warning",
          title: "Assignment Conflict",
          text: errorMessage,
          confirmButtonText: "OK",
          confirmButtonColor: "#00AEEF",
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Button logic
  const isRefereesTab = activeTab === "referees";
  const primaryButtonDisabled = isRefereesTab
    ? selectedReferees.length === 0
    : !selectedCrew;

  const primaryButtonLoading = isRefereesTab
    ? assignRefereeMutation.isPending
    : assignCrewMutation.isPending;

  const primaryButtonText = isRefereesTab
    ? `Assign Referees (${selectedReferees.length}/${maxReferees})`
    : selectedCrew
    ? "Assign Selected Crew"
    : "Select a Crew to Assign";

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
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mt-4">
        {/* === Referees Tab === */}
        <TabPane tab="Assign Referees" key="referees">
          <div className="mt-4 space-y-5">
            <Search
              placeholder="Search referees by name..."
              allowClear
              size="large"
              prefix={<BiSearch className="text-gray-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
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
                      onClick={() => !disabled && handleRefereeToggle(ref)}
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all
                        ${
                          isSelected
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

        {/* === Assign Crew Tab === */}
        <TabPane tab="Assign Crew" key="crew">
          <div className="mt-6">
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
              >
                {crewListData.map((crew) => (
                  <div
                    key={crew.id}
                    onClick={() =>
                      setSelectedCrew(selectedCrew === crew.id ? null : crew.id)
                    }
                    className={`
                      border-2 rounded-xl p-6 transition-all cursor-pointer
                      ${
                        selectedCrew === crew.id
                          ? "border-[#00AEEF] bg-blue-50 shadow-lg ring-2 ring-[#00AEEF]/20"
                          : "border-gray-200 hover:border-[#00AEEF] hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Radio value={crew.id} className="mt-1.5" />

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg">{crew.name}</h4>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                                ${
                                  crew.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >
                              {crew.status}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            {crew.member_count || crew.members?.length || 0}{" "}
                            members
                          </p>

                          {/* Member Avatars Stack */}
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

      {/* Footer Actions */}
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
          {primaryButtonText}
        </CommonSubmitBtn>
      </div>
    </Modal>
  );
};

export default ScheduleAddModal;
