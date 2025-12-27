import { useState, useEffect, useMemo } from "react";
import { Modal, Input, Tabs } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { BiSearch } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { ImBlocked } from "react-icons/im";

const { Search } = Input;
const { TabPane } = Tabs;

const ScheduleAddModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  handleBlockCourt,
  onAssignSuccess,
  existingReferees = [],
  campId,
  selectedDate
}) => {
  const [activeTab, setActiveTab] = useState("referees");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // === Individual Referees Query ===
  const { data: refereeListData = [], isLoading: loadingReferees } = useQuery({
    queryKey: ["referee-list", campId, selectedCourt?.slot_id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/available-referees-with-time-check`
      );
      return res?.data?.data?.available_referees || [];
    },
    enabled: !!campId && isModalOpen && !!selectedCourt?.slot_id && activeTab === "referees",
  });

  // === Crew List Query ===
  const { data: crewListData = [], isLoading: loadingCrews } = useQuery({
    queryKey: ["crew-list", campId, selectedCourt?.slot_id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/available-crews`
      );
      return res?.data?.data?.available_crews || [];
    },
    enabled: !!campId && isModalOpen && !!selectedCourt?.slot_id && activeTab === "crew",
  });

  // Initialize selections
  useEffect(() => {
    if (isModalOpen && activeTab === "referees" && refereeListData.length > 0) {
      const preSelected = refereeListData.filter((ref) => ref.is_assigned_to_this_slot);
      setSelectedReferees(preSelected);

      if (existingReferees.length > 0) {
        const merged = [...preSelected];
        existingReferees.forEach((existing) => {
          if (!merged.some((m) => m.id === existing.id || m.id === existing.referee_id)) {
            merged.push({
              id: existing.referee_id || existing.id,
              name: existing.referee?.name || existing.name,
              avatar: existing.referee?.avatar,
            });
          }
        });
        setSelectedReferees(merged);
      }
    }

    if (activeTab === "crew") {
      setSelectedCrew(null);
    }
  }, [isModalOpen, refereeListData, existingReferees, activeTab]);

  const filteredReferees = useMemo(() => {
    if (!searchTerm || activeTab !== "referees") return refereeListData;
    return refereeListData.filter((ref) =>
      ref.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [refereeListData, searchTerm, activeTab]);

  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) return prev.filter((r) => r.id !== referee.id);
      if (prev.length >= 3) {
        toast.warning("Maximum 3 referees can be assigned");
        return prev;
      }
      return [...prev, referee];
    });
  };

  const handleCrewSelect = (crew) => {
    setSelectedCrew(crew.id === selectedCrew ? null : crew.id);
  };

  // Mutations
  const assignRefereeMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      selectedReferees.forEach((ref) => formData.append("referee_ids[]", ref.id));
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
    onError: () => toast.error("Failed to assign referees"),
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
    onError: () => toast.error("Failed to assign crew"),
  });

  // Determine which primary action to show
  const isRefereesTab = activeTab === "referees";
  const primaryButtonDisabled = isRefereesTab
    ? selectedReferees.length === 0
    : !selectedCrew;
  const primaryButtonLoading = isRefereesTab
    ? assignRefereeMutation.isPending
    : assignCrewMutation.isPending;
  const primaryButtonText = isRefereesTab
    ? `Update Assignment (${selectedReferees.length}/3)`
    : "Assign Selected Crew";

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
      width={900}
      centered
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mt-4 text-primary!">
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
              <p className="font-medium">Available Referees ({filteredReferees.length})</p>
              <p className="text-sm font-semibold text-[#00AEEF]">
                Selected: {selectedReferees.length}/3
              </p>
            </div>

            <div className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin">
              {loadingReferees ? (
                <div className="text-center py-12 text-gray-500">Loading referees...</div>
              ) : filteredReferees.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? "No match found" : "No available referees"}
                </div>
              ) : (
                filteredReferees.map((ref) => {
                  const isSelected = selectedReferees.some((r) => r.id === ref.id);
                  const disabled = !isSelected && selectedReferees.length >= 3;

                  return (
                    <div
                      key={ref.id}
                      onClick={() => !disabled && handleRefereeToggle(ref)}
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer
                        ${isSelected ? "border-[#00AEEF] bg-blue-50 shadow-md" : 
                          disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : 
                          "hover:border-[#00AEEF] hover:shadow-md border-gray-200"}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ref.avatar || "/default-avatar.png"}
                          alt={ref.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => (e.target.src = "/default-avatar.png")}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{ref.name}</p>
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
                        className="w-5 h-5 text-[#00AEEF] rounded"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabPane>

        {/* === Crew Assign Tab === */}
        <TabPane tab="Assign Crew" key="crew">
          <div className="mt-4 space-y-5">
            <div className="text-sm text-gray-600 mb-4">
              Select a pre-made crew to assign all its members at once.
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-3 scrollbar-thin">
              {loadingCrews ? (
                <div className="text-center py-12 text-gray-500">Loading crews...</div>
              ) : crewListData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No available crews</div>
              ) : (
                crewListData.map((crew) => {
                  const isSelected = selectedCrew === crew.id;

                  return (
                    <div
                      key={crew.id}
                      onClick={() => handleCrewSelect(crew)}
                      className={`
                        border-2 rounded-xl p-5 transition-all cursor-pointer
                        ${isSelected 
                          ? "border-[#00AEEF] bg-blue-50 shadow-lg" 
                          : "border-gray-200 hover:border-[#00AEEF] hover:shadow-md"}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{crew.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {crew.members.length} referees
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-[#00AEEF] flex items-center justify-center">
                          {isSelected && <div className="w-3 h-3 bg-[#00AEEF] rounded-full" />}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        {crew.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-2">
                            <img
                              src={member.avatar || "/default-avatar.png"}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => (e.target.src = "/default-avatar.png")}
                            />
                            <span className="truncate">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Unified Button Row at Bottom */}
      <div className="flex justify-between items-center mt-6 pt-4">
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
        >
          {primaryButtonText}
        </CommonSubmitBtn>
      </div>
    </Modal>
  );
};

export default ScheduleAddModal;