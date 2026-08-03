import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  useAvailableRefereesForCrew,
  useCreateCrew,
} from "@/hooks/api/director-hooks/useCrews";

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
  const [crewName, setCrewName] = useState("");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const refereesListRef = useRef(null);

  const createCrewMutation = useCreateCrew(campId);

  const {
    data,
    isLoading: loadingReferees,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAvailableRefereesForCrew(campId, "new", openModal);

  const allReferees = data?.pages?.flatMap((page) => page?.referees || []) || [];
  // console.log(allReferees, 'referees');

  const filteredReferees = allReferees.filter((ref) =>
    ref?.name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  // Infinite scroll observer (unchanged)
  useEffect(() => {
    if (
      !refereesListRef.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      loadingReferees
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const sentinel = document.createElement("div");
    sentinel.id = "scroll-sentinel";
    refereesListRef.current.appendChild(sentinel);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.parentNode?.removeChild(sentinel);
    };
  }, [hasNextPage, isFetchingNextPage, loadingReferees, fetchNextPage]);

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

  const handleCreateCrew = async () => {
    if (!crewName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Name",
        text: "Crew name is required",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (selectedReferees.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Referees",
        text: "Please select at least one referee",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const payload = {
      name: crewName.trim(),
      referee_ids: selectedReferees.map((r) => r.id),
    };

    try {
      await createCrewMutation.mutateAsync(payload);
      handleCloseModal();
    } catch {
      // Error toast is handled by the mutation hook
    }
  };

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
      destroyOnClose
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
            <p className="font-medium text-gray-700">Select Referees (Max 6)</p>
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

          <div
            ref={refereesListRef}
            className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin scrollbar-thumb-gray-400"
          >
            {loadingReferees && !data ? (
              <div className="text-center py-12">
                <Spin size="large" tip="Loading referees..." />
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-red-500">
                Failed to load referees. Please try again.
              </div>
            ) : filteredReferees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm
                  ? "No referees match your search"
                  : "No available referees found"}
              </div>
            ) : (
              <>
                {filteredReferees.map((ref) => {
                  const isSelected = selectedReferees.some(
                    (r) => r.id === ref.id
                  );
                  const isDisabled =
                    !isSelected && selectedReferees.length >= 6;

                  return (
                    <div
                      key={ref.id}
                      onClick={() => !isDisabled && handleRefereeToggle(ref)}
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer
                        ${
                          isSelected
                            ? "border-[#00AEEF] bg-blue-50 shadow-md"
                            : isDisabled
                            ? "bg-gray-50 opacity-60 cursor-not-allowed"
                            : "hover:border-[#00AEEF] hover:shadow-md border-gray-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={ref.avatar}
                          size={48}
                          className="border-2 border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {ref.name} {ref.jersey_number ? `#${ref.jersey_number}` : ""}
                          </p>
                          <p className="text-sm text-gray-500">{ref.email}</p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-5 h-5 text-[#00AEEF] rounded focus:ring-[#00AEEF] pointer-events-none"
                      />
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="text-center py-8">
                    <Spin tip="Loading more referees..." />
                  </div>
                )}

                {!hasNextPage && allReferees.length > 0 && !loadingReferees && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    All available referees loaded
                  </div>
                )}
              </>
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
            disabled={
              !crewName.trim() ||
              selectedReferees.length === 0 ||
              createCrewMutation.isPending
            }
          >
            {createCrewMutation.isPending ? "Creating..." : "Create Crew"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCrewModal;