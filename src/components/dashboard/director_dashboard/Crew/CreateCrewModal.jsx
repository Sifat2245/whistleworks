// components/crew/CreateCrewModal.jsx
import { useState, useEffect } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const { TextArea } = Input;

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
  const axiosInstance = useAxiosSecure();

  const [crewName, setCrewName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available referees
  const {
    data: responseData,
    isLoading: loadingReferees,
    isError,
  } = useQuery({
    queryKey: ["available-referees-for-crew", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/camp/${campId}/available-referees-for-crew`);
      return res?.data;
    },
    enabled: !!campId && openModal,
  });

  const refereesData = responseData?.data?.referees || [];

  const filteredReferees = refereesData.filter((ref) =>
    ref?.name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  // Toggle referee selection (max 3)
  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= 3) {
        toast.warning("Maximum 3 referees can be selected");
        return prev;
      }
      return [...prev, referee];
    });
  };

  // Create crew
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
      setSearchTerm("");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create crew");
    },
  });

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
      members: selectedReferees.map((r) => r.id),
    };

    createCrewMutation.mutate(payload);
  };

  // Reset when modal opens
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
      width={900}
      centered
    >
      <div className="mt-4 space-y-6">
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
            placeholder="Brief description about this crew..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="large"
          />
        </div>

        {/* Referees Selection */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium">Available Referees ({filteredReferees.length})</p>
            <p className="text-sm font-semibold text-[#00AEEF]">
              Selected: {selectedReferees.length}/3
            </p>
          </div>

          <Input
            placeholder="Search referees by name..."
            allowClear
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin">
            {loadingReferees ? (
              <div className="text-center py-12 text-gray-500">
                <Spin size="large" />
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-red-500">
                Failed to load referees
              </div>
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
                      ${isSelected 
                        ? "border-[#00AEEF] bg-blue-50 shadow-md" 
                        : disabled 
                        ? "bg-gray-50 opacity-60 cursor-not-allowed" 
                        : "hover:border-[#00AEEF] hover:shadow-md border-gray-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={ref.avatar || "/default-avatar.png"}
                        size={48}
                        className="border-2 border-gray-200"
                      />
                      <div>
                        <p className="font-medium">{ref.name}</p>
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4">
          <Button size="large" onClick={handleCloseModal}>
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