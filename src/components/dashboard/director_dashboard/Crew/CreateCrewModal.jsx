// components/crew/CreateCrewModal.jsx
import { useState, useEffect } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const { TextArea } = Input;

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
    console.log(campId, "from modal");
  const axiosInstance = useAxiosSecure();

  const [crewName, setCrewName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available referees for crew
  const {
    data: refereesData = [],
    isLoading: loadingReferees,
    isError,
  } = useQuery({
    queryKey: ["available-referees-for-crew", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/camp/${campId}/available-referees-for-crew`);
      return res?.data?.data || [];
    },
    enabled: !!campId && openModal,
  });

  // Filter referees by search
  const filteredReferees = refereesData.filter((ref) =>
    ref.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create crew mutation
  const createCrewMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(`/v1/camp/${campId}/crew/create`, payload);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Crew created successfully!");
      handleCloseModal();
      // Reset form
      setCrewName("");
      setDescription("");
      setSelectedReferees([]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create crew");
    },
  });

  const handleToggleReferee = (referee) => {
    setSelectedReferees((prev) => {
      if (prev.find((r) => r.id === referee.id)) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= 3) {
        toast.warning("Maximum 3 referees can be selected");
        return prev;
      }
      return [...prev, referee];
    });
  };

  const handleCreateCrew = () => {
    if (!crewName.trim()) {
      toast.error("Crew name is required");
      return;
    }
    if (selectedReferees.length === 0) {
      toast.error("Please select at least one referee");
      return;
    }

    const payload = {
      name: crewName,
      description: description || null,
      referee_ids: selectedReferees.map((r) => r.id),
    };

    createCrewMutation.mutate(payload);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (openModal) {
      setCrewName("");
      setDescription("");
      setSelectedReferees([]);
      setSearchTerm("");
    }
  }, [openModal]);

  return (
    <Modal
      title={<span className="text-xl font-semibold">Create New Crew</span>}
      open={openModal}
      onCancel={handleCloseModal}
      footer={null}
      width={600}
      centered
    >
      <div className="space-y-6 mt-4">
        {/* Crew Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crew Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Elite Officials"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            size="large"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <TextArea
            rows={3}
            placeholder="Brief description of this crew..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Search Referees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Referees (Max 3)
          </label>
          <Input
            placeholder="Search referees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            className="mb-3"
          />

          <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            {loadingReferees ? (
              <div className="text-center py-8">
                <Spin />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500 py-8">
                Failed to load referees
              </div>
            ) : filteredReferees.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? "No referees found" : "No available referees"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredReferees.map((ref) => {
                  const isSelected = selectedReferees.some((r) => r.id === ref.id);
                  return (
                    <div
                      key={ref.id}
                      onClick={() => handleToggleReferee(ref)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                        ${isSelected
                          ? "bg-[#00AEEF] text-white shadow-md"
                          : "bg-white hover:bg-gray-100 border"
                        }`}
                    >
                      <Avatar
                        src={ref.avatar || "/default-avatar.png"}
                        size={40}
                        className="shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{ref.name}</p>
                        <p className="text-xs opacity-70">{ref.email}</p>
                      </div>
                      {isSelected && (
                        <span className="text-sm font-semibold">Selected</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Selected: <strong>{selectedReferees.length}/3</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={handleCloseModal} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleCreateCrew}
            loading={createCrewMutation.isPending}
            disabled={!crewName.trim() || selectedReferees.length === 0}
          >
            Create Crew
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCrewModal;