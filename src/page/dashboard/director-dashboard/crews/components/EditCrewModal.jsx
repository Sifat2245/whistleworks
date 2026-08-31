import { useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { LuTrash2 } from "react-icons/lu";
import {
  useAvailableRefereesForCrew,
  useUpdateCrew,
} from "@/hooks/api/director-hooks/useCrews";

const EditCrewModal = ({ openModal, handleCloseModal, crewData, campId }) => {
  const [crewName, setCrewName] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState([]);

  const crewId = crewData?.id;
  const updateCrewMutation = useUpdateCrew(crewId, campId);

  const {
    data,
    isLoading: loadingReferees,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAvailableRefereesForCrew(campId, crewId || "edit", openModal);

  const fetchedReferees = data?.pages?.flatMap((page) => page?.referees || []) || [];

  // Combine fetched available referees with existing crew members so selected refs are present in dropdown
  const existingReferees = (crewData?.members || []).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    jersey_number: m.jersey_number,
    avatar: m.avatar,
  }));

  const allReferees = [
    ...existingReferees,
    ...fetchedReferees.filter((r) => !existingReferees.some((m) => m.id === r.id)),
  ];

  // Fetch all pages of referees automatically on modal open
  useEffect(() => {
    if (openModal && hasNextPage && !isFetchingNextPage && !loadingReferees) {
      fetchNextPage();
    }
  }, [openModal, hasNextPage, isFetchingNextPage, loadingReferees, fetchNextPage]);

  useEffect(() => {
    if (openModal && crewData) {
      setCrewName(crewData.name || "");
      setDescription(crewData.description || "");
      if (crewData.members && crewData.members.length > 0) {
        setSlots(
          crewData.members.map((m, index) => ({
            id: index + 1,
            position: m.position || `Referee ${index + 1}`,
            refereeId: m.id,
          }))
        );
      } else {
        setSlots([{ id: 1, position: "Referee 1", refereeId: null }]);
      }
    }
  }, [openModal, crewData]);

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

  const handleSaveCrew = async () => {
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
      ...(description.trim() ? { description: description.trim() } : {}),
      referee_ids: validSlots.map((s) => s.refereeId),
      positions: validSlots.map((s) => s.position.trim()),
    };

    try {
      await updateCrewMutation.mutateAsync(payload);
      handleCloseModal();
    } catch {
      // Handled by react-query mutation
    }
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-100 pb-3">
          <span className="text-xl font-bold text-gray-800">Edit Crew</span>
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

        {/* Description (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
            Description <span className="text-gray-400 font-normal font-sans lowercase">(optional)</span>
          </label>
          <Input.TextArea
            placeholder="e.g., Main referee crew for field 1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={200}
            className="rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Positions & Referees Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Crew Members & Positions
              </label>
              <p className="text-xs text-gray-400 mt-0.5">
                Update the roles and referees assigned to this crew.
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
            {slots.map((slot) => {
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
            onClick={handleSaveCrew}
            loading={updateCrewMutation.isPending}
            disabled={
              !crewName.trim() ||
              slots.filter((s) => s.refereeId).length === 0 ||
              updateCrewMutation.isPending
            }
            className="rounded-lg bg-primary hover:bg-primary/90 font-semibold"
          >
            {updateCrewMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCrewModal;
