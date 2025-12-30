import { useState, useEffect } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient(); // Access directly (cleaner than prop drilling)

  const [crewName, setCrewName] = useState("");
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

  // Toggle referee selection (max 6)
  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= 6) {
        toast.warning("Maximum 6 referees can be selected per crew");
        return prev;
      }
      return [...prev, referee];
    });
  };

  // Create crew mutation
  const createCrewMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(`/v1/camp/${campId}/crew/create`, payload);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Crew created successfully!");

      // Invalidate crew list to refresh UI automatically
      queryClient.invalidateQueries({
        queryKey: ["crew-groups", campId],
      });

      handleCloseModal();
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
      name: crewName.trim(),
      referee_ids: selectedReferees.map((r) => r.id),
    };

    console.log(payload,"submited data");
    createCrewMutation.mutate(payload);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (openModal) {
      setCrewName("");
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
      destroyOnClose // Ensures fresh state on reopen
    >
      <div className="mt-4 space-y-6">
        {/* Crew Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crew Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Elite Officials Crew"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            size="large"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {crewName.length}/50 characters
          </p>
        </div>

        {/* Referees Selection */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-gray-700">
              Select Referees (Max 6)
            </p>
            <p className="text-sm font-semibold text-[#00AEEF]">
              Selected: {selectedReferees.length}/6
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

          <div className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin scrollbar-thumb-gray-400">
            {loadingReferees ? (
              <div className="text-center py-12">
                <Spin size="large" tip="Loading referees..." />
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-red-500">
                Failed to load referees. Please try again.
              </div>
            ) : filteredReferees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? "No referees match your search" : "No available referees"}
              </div>
            ) : (
              filteredReferees.map((ref) => {
                const isSelected = selectedReferees.some((r) => r.id === ref.id);
                const isDisabled = !isSelected && selectedReferees.length >= 6;

                return (
                  <div
                    key={ref.id}
                    onClick={() => !isDisabled && handleRefereeToggle(ref)}
                    className={`
                      border rounded-xl p-4 flex items-center justify-between transition-all
                      ${isSelected
                        ? "border-[#00AEEF] bg-blue-50 shadow-md cursor-pointer"
                        : isDisabled
                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                        : "hover:border-[#00AEEF] hover:shadow-md border-gray-200 cursor-pointer"
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
                        <p className="font-medium text-gray-800">{ref.name}</p>
                        <p className="text-sm text-gray-500">{ref.email}</p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-5 h-5 text-[#00AEEF] rounded focus:ring-[#00AEEF] cursor-pointer"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
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
            {createCrewMutation.isPending ? "Creating..." : "Create Crew"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCrewModal;