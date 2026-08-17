import { useState, useEffect } from "react";
import { Modal, Input, Button, Spin, Select } from "antd";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { LuTrash2 } from "react-icons/lu";
import {
  useAvailableRefereesForCrew,
  useCreateCrew,
} from "@/hooks/api/director-hooks/useCrews";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
  const [crewName, setCrewName] = useState("");
  const [slots, setSlots] = useState([]);

  const createCrewMutation = useCreateCrew(campId);
  const { data: campDetails } = useGetCampDetails(campId);
  const sportName = campDetails?.sport?.sports_name || "";

  const {
    data,
    isLoading: loadingReferees,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAvailableRefereesForCrew(campId, "new", openModal);

  const allReferees = data?.pages?.flatMap((page) => page?.referees || []) || [];

  // Fetch all pages of referees automatically on modal open
  useEffect(() => {
    if (openModal && hasNextPage && !isFetchingNextPage && !loadingReferees) {
      fetchNextPage();
    }
  }, [openModal, hasNextPage, isFetchingNextPage, loadingReferees, fetchNextPage]);

  const getDefaultPositions = (sportName) => {
    const defaults = [];
    const lowerSport = (sportName || "").toLowerCase();
    if (lowerSport.includes("basketball")) {
      defaults.push("Crew Chief", "Referee", "Umpire");
    } else if (
      lowerSport.includes("soccer") ||
      lowerSport.includes("football") ||
      lowerSport.includes("scocer")
    ) {
      defaults.push("Center Referee", "Assistant Referee 1", "Assistant Referee 2", "Fourth Official");
    } else if (
      lowerSport.includes("volleyball") ||
      lowerSport.includes("volyball")
    ) {
      defaults.push("First Referee (R1)", "Second Referee (R2)", "Line Judge 1", "Line Judge 2");
    } else {
      defaults.push("Referee 1", "Referee 2");
    }
    return defaults;
  };

  useEffect(() => {
    if (openModal) {
      setCrewName("");
      const defaults = getDefaultPositions(sportName);
      setSlots(
        defaults.map((pos, index) => ({
          id: index + 1,
          position: pos,
          refereeId: null,
        }))
      );
    }
  }, [openModal, sportName]);

  const getAvailableRefereesForSlot = (currentSlotId) => {
    return allReferees.filter((ref) => {
      const isSelectedInOtherSlot = slots.some(
        (s) => s.id !== currentSlotId && s.refereeId === ref.id
      );
      return !isSelectedInOtherSlot;
    });
  };

  const handleAddSlot = () => {
    if (slots.length >= 6) {
      toast.error("Maximum 6 members can be selected per crew");
      return;
    }
    const nextId = slots.length > 0 ? Math.max(...slots.map((s) => s.id)) + 1 : 1;
    setSlots([
      ...slots,
      { id: nextId, position: `Referee ${slots.length + 1}`, refereeId: null },
    ]);
  };

  const handleRemoveSlot = (slotId) => {
    if (slots.length <= 1) {
      toast.error("A crew must have at least 1 member");
      return;
    }
    setSlots(slots.filter((s) => s.id !== slotId));
  };

  const handleUpdateSlot = (slotId, key, value) => {
    setSlots(
      slots.map((s) => (s.id === slotId ? { ...s, [key]: value } : s))
    );
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

    const validSlots = slots.filter((s) => s.refereeId && s.position.trim());
    if (validSlots.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Members Assigned",
        text: "Please add at least one member with a position and selected referee",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Check if any slot has a selected referee but missing position, or vice versa
    const hasIncomplete = slots.some(
      (s) => (s.refereeId && !s.position.trim()) || (!s.refereeId && s.position.trim())
    );
    if (hasIncomplete) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Positions",
        text: "Please ensure all added slots have both a Position Title and a selected Referee.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const payload = {
      name: crewName.trim(),
      referee_ids: validSlots.map((s) => s.refereeId),
    };

    try {
      const response = await createCrewMutation.mutateAsync(payload);
      // Save positions mapping locally
      const crewId =
        response?.data?.data?.id ||
        response?.data?.data?.crew?.id ||
        response?.data?.id;

      if (crewId) {
        const positionsMap = {};
        validSlots.forEach((s) => {
          positionsMap[s.refereeId] = s.position.trim();
        });
        localStorage.setItem(`crew_positions_${crewId}`, JSON.stringify(positionsMap));
      }
      handleCloseModal();
    } catch {
      // Handled by react-query mutation
    }
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-100 pb-3">
          <span className="text-xl font-bold text-gray-800">Create New Crew</span>
        </div>
      }
      open={openModal}
      onCancel={handleCloseModal}
      footer={null}
      width={720}
      centered
      destroyOnClose
    >
      <div className="mt-5 space-y-6">
        {/* Crew Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
            Crew Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Elite Officials Crew"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            size="large"
            maxLength={50}
            className="rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs text-gray-400">
              Give your referee crew a distinct and professional name.
            </span>
            <span className="text-xs font-medium text-gray-500">
              {crewName.length}/50
            </span>
          </div>
        </div>

        {/* Positions & Referees Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Crew Members & Positions
              </label>
              <p className="text-xs text-gray-400 mt-0.5">
                Define the roles and select the referee for each slot.
              </p>
            </div>
            <Button
              type="dashed"
              onClick={handleAddSlot}
              disabled={slots.length >= 6}
              className="flex items-center gap-1 hover:border-primary hover:text-primary transition-colors font-medium rounded-lg text-xs"
            >
              + Add Position
            </Button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {slots.map((slot, index) => {
              const availableRefs = getAvailableRefereesForSlot(slot.id);
              return (
                <div
                  key={slot.id}
                  className="flex items-center gap-3 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl relative hover:border-primary/30 transition-all duration-200"
                >
                  {/* Position Field */}
                  <div className="flex-1">
                    <Input
                      placeholder="e.g. Crew Chief"
                      value={slot.position}
                      onChange={(e) => handleUpdateSlot(slot.id, "position", e.target.value)}
                      size="large"
                      className="rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>

                  {/* Referee Selection */}
                  <div className="flex-[1.5]">
                    <Select
                      showSearch
                      placeholder="Select a referee..."
                      optionFilterProp="label"
                      value={slot.refereeId}
                      onChange={(val) => handleUpdateSlot(slot.id, "refereeId", val)}
                      size="large"
                      className="w-full rounded-lg"
                      loading={loadingReferees}
                      options={availableRefs.map((ref) => ({
                        value: ref.id,
                        label: `${ref.name} ${ref.jersey_number ? `#${ref.jersey_number}` : ""} (${ref.email})`,
                      }))}
                    />
                  </div>

                  {/* Delete Button */}
                  {slots.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg border border-gray-200 hover:border-red-200 cursor-pointer shadow-sm"
                      title="Remove slot"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button size="large" onClick={handleCloseModal} className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleCreateCrew}
            loading={createCrewMutation.isPending}
            disabled={
              !crewName.trim() ||
              slots.filter((s) => s.refereeId).length === 0 ||
              createCrewMutation.isPending
            }
            className="rounded-lg bg-primary hover:bg-primary/90 font-semibold"
          >
            {createCrewMutation.isPending ? "Creating..." : "Create Crew"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCrewModal;