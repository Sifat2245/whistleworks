import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ScheduleAddModal from "./ScheduleAddModal";
import CourtSlotBox from "./CourtSlotBox";
import ScheduleActionButtons from "./ScheduleActionButtons";
import ScheduleSkeleton from "./ScheduleSkeleton";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MdModeEditOutline } from "react-icons/md";
import {
  useAvailableDates,
  useCourtInfo,
  useBulkUpdateCourtNames,
  useToggleBlockSlot,
  useBulkToggleBlock,
} from "@/hooks/api/director-hooks/useGameAssingments";

const CourtLists = ({ campData }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Editing state
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  // ── Hooks ──────────────────────────────────────────────────────
  const { data: initialData, isLoading: loadingInitial } = useAvailableDates(
    campData?.id,
  );

  const availableDates = initialData?.available_dates || [];
  const availableLocations = initialData?.available_locations || [];

  const { data, isLoading } = useCourtInfo(campData?.id, selectedDate);

  const courtHeaders = data?.court_headers || [];
  const maxReferees = data?.schedule?.max_referees_per_slot;
  const scheduleId = data?.schedule?.schedule_id;
  const timeSlots = data?.time_slots || [];

  // ── React Query client for cache invalidation ────────────────
  const queryClient = useQueryClient();

  // ── Helper callbacks (defined before mutation hooks that reference them) ──
  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditValue("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
  };

  const handleAssignSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["court-info", campData?.id, selectedDate],
    });
    handleCloseModal();
  };

  // ── Mutation hooks ──────────────────────────────────────────────
  const bulkUpdateCourtNamesMutation = useBulkUpdateCourtNames(
    campData?.id,
    selectedDate,
    { onSuccess: cancelEdit },
  );

  const toggleBlockMutation = useToggleBlockSlot(
    campData?.id,
    selectedDate,
    { onSuccess: handleCloseModal },
  );

  const bulkToggleBlockMutation = useBulkToggleBlock(
    campData?.id,
    selectedDate,
  );

  // ── Set defaults from URL or fallback ──────────────────────────
  useEffect(() => {
    const urlDate = searchParams.get("date");
    const urlLocation = searchParams.get("location");

    // Set date
    if (availableDates.length > 0) {
      const dateItem =
        urlDate && availableDates.find((d) => d.date.startsWith(urlDate))
          ? availableDates.find((d) => d.date.startsWith(urlDate))
          : availableDates[0];

      setActiveFilter(dateItem.formatted);
      setSelectedDate(dateItem.date.split("T")[0]);
    }

    // Set location
    if (availableLocations.length > 0) {
      const locationId =
        urlLocation &&
        availableLocations.some((l) => l.location_id.toString() === urlLocation)
          ? parseInt(urlLocation)
          : availableLocations[0].location_id;

      setSelectedLocationId(locationId);
    }
  }, [availableDates, availableLocations, searchParams]);

  const updateUrlParams = (date, locationId) => {
    setSearchParams({
      date,
      location: locationId.toString(),
    });
  };

  const handleDateClick = (item) => {
    const newDate = item.date.split("T")[0];
    setActiveFilter(item.formatted);
    setSelectedDate(newDate);
    updateUrlParams(
      newDate,
      selectedLocationId || availableLocations[0]?.location_id,
    );
  };

  const handleLocationClick = (locationId) => {
    setSelectedLocationId(locationId);
    updateUrlParams(selectedDate, locationId);
  };

  // Filter courts by selected location
  const filteredCourtHeaders = selectedLocationId
    ? courtHeaders.filter((h) => h.location_id === selectedLocationId)
    : courtHeaders;

  const getFilteredCourtsForSlot = (slot) => {
    return selectedLocationId
      ? slot.courts.filter((court) => court.location_id === selectedLocationId)
      : slot.courts;
  };

  const startEditing = (courtIdentifier, currentName) => {
    setEditingSlotId(courtIdentifier);
    setEditValue(currentName || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveEditBulk = (locationId, courtNumber) => {
    if (!editValue.trim()) {
      toast.error("Court name cannot be empty");
      return;
    }

    bulkUpdateCourtNamesMutation.mutate({
      location_id: locationId,
      court_number: courtNumber,
      new_court_name: editValue.trim(),
    });
  };

  const handleBoxClick = (court, timeSlot) => {
    if (court?.is_blocked) return;
    setSelectedCourt(court);
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };



  const handleBlockCourt = () => {
    if (!selectedCourt?.slot_id) return;
    toggleBlockMutation.mutate(selectedCourt?.slot_id);
  };

  const handleBulkBlock = async (time24h, date) => {
    if (!scheduleId) return;

    const slot = timeSlots.find((s) => s.time_24h === time24h);
    if (!slot) return;

    const filteredCourts = getFilteredCourtsForSlot(slot);
    const allBlocked = filteredCourts.every((court) => court.is_blocked);
    const action = allBlocked ? "unblock" : "block";
    const actionText = allBlocked ? "Unblock" : "Block";

    const result = await Swal.fire({
      title: `${actionText} All Visible Courts?`,
      text: `This will ${action} all courts in the ${slot.time} time slot on ${date} for the selected location.`,
      icon: allBlocked ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: action === "block" ? "#ef4444" : "#10b981",
    });

    if (result.isConfirmed) {
      bulkToggleBlockMutation.mutate({ scheduleId, date, start_time: time24h, action });
    }
  };

  const handleUndoBlock = (slotId) => {
    toggleBlockMutation.mutate(slotId);
  };

  if (loadingInitial || isLoading) return <ScheduleSkeleton />;
  if (availableDates.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">No available dates.</div>
    );

  return (
    <div className="w-full mt-6 mb-16">
      {/* Location Filter */}
      {availableLocations.length > 1 && (
        <div className="flex gap-4 mb-6 overflow-x-auto pb-4">
          {availableLocations.map((loc) => (
            <button
              key={loc.location_id}
              onClick={() => handleLocationClick(loc.location_id)}
              className={`border border-[#00AEEF] px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer flex items-center gap-3
                ${
                  selectedLocationId === loc.location_id
                    ? "bg-[#00AEEF] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span>{loc.address}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                {loc.court_count} courts
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Date Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-6">
        {availableDates.map((item) => (
          <button
            key={item.formatted}
            onClick={() => handleDateClick(item)}
            className={`border border-[#00AEEF] px-6 py-3 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer
              ${
                activeFilter === item.formatted
                  ? "bg-[#00AEEF] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            <div className="text-center font-semibold">{item.formatted}</div>
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="w-full border border-gray-300 rounded-xl overflow-hidden">
        <div className="max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex gap-6 bg-gray-50 border-b border-gray-300 sticky top-0 z-20">
              <div className="w-34 shrink-0 px-6 py-6 text-lg font-semibold sticky left-0 bg-gray-50 z-30 border-r border-gray-300">
                <span>Time</span>
              </div>

              <div className="flex gap-6 py-6">
                {filteredCourtHeaders.map((court) => {
                  const isEditingThisCourt =
                    editingSlotId === court.court_number;

                  return (
                    <div
                      key={court.court_number}
                      className="shrink-0 w-72 text-center"
                    >
                      {/* Court name - editable only on Enter */}
                      {isEditingThisCourt ? (
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                saveEditBulk(
                                  court.location_id,
                                  court.court_number,
                                );
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            className="text-[#00AEEF] font-bold text-xl bg-white border-b-2 border-[#00AEEF] outline-none px-2 py-1 text-center w-full"
                            placeholder="Court name..."
                            autoFocus
                          />

                          {/* Optional small hint while editing */}
                          <div className="absolute -bottom-5 left-0 right-0 text-xs text-gray-500 text-center pointer-events-none">
                            Press Enter to save • Esc to cancel
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            startEditing(
                              court.court_number,
                              court.court_name || `Court ${court.court_number}`,
                            )
                          }
                          className="text-[#00AEEF] font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity flex justify-center items-center gap-2 group"
                          title="Click to edit court name (updates all time slots)"
                        >
                          {court.court_name || `Court ${court.court_number}`}
                          <MdModeEditOutline className="opacity-0 group-hover:opacity-100 transition-opacity text-lg" />
                        </div>
                      )}

                      {/* Location hint when multiple locations exist */}
                      {!isEditingThisCourt && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {court.address}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rows */}
            {timeSlots.map((slot) => {
              const filteredCourts = getFilteredCourtsForSlot(slot);
              const allBlocked = filteredCourts.every(
                (court) => court.is_blocked,
              );

              return (
                <div
                  key={slot.time_24h}
                  className="flex gap-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-34 shrink-0 px-6 py-10 text-lg font-medium text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-200 flex flex-col items-center justify-center gap-6">
                    <span>{slot.time}</span>

                    <button
                      onClick={() =>
                        handleBulkBlock(slot.time_24h, selectedDate)
                      }
                      disabled={bulkToggleBlockMutation.isPending}
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 text-white font-medium transition-all cursor-pointer
                        ${
                          allBlocked
                            ? "bg-green-400 hover:bg-green-500"
                            : "bg-red-400 hover:bg-red-500"
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      {allBlocked ? (
                        <HiLockOpen className="w-3 h-3" />
                      ) : (
                        <HiLockClosed className="w-3 h-3" />
                      )}
                      <span className="text-xs">
                        {allBlocked ? "Unblock" : "Block"}
                      </span>
                    </button>
                  </div>

                  <div className="flex gap-6 py-8">
                    {filteredCourts.map((court) => {
                      const isBlocked = court?.is_blocked;
                      const referees = court?.assignments || [];

                      return (
                        <div key={court.slot_id} className="shrink-0 w-72">
                          {/* Court Slot Box */}
                          <CourtSlotBox
                            court={court}
                            timeSlot={slot}
                            isBlocked={isBlocked}
                            referees={referees}
                            campId={campData?.id}
                            selectedDate={selectedDate}
                            maxReferees={maxReferees}
                            onClick={handleBoxClick}
                            onUndoBlock={handleUndoBlock}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ScheduleActionButtons campId={campData?.id} />

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        selectedTimeSlot={selectedTimeSlot}
        handleBlockCourt={handleBlockCourt}
        campId={campData?.id}
        maxReferees={maxReferees}
        selectedDate={selectedDate}
        onAssignSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default CourtLists;
