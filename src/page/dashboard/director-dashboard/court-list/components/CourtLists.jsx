import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ScheduleAddModal from "./ScheduleAddModal";
import CourtSlotBox from "./CourtSlotBox";
import CourtSlotCardMobile from "./CourtSlotCardMobile";
import ScheduleActionButtons from "./ScheduleActionButtons";
import ScheduleSkeleton from "./ScheduleSkeleton";
import {
  LuMapPin,
  LuCalendarDays,
  LuClock,
  LuLayoutGrid,
  LuUsers,
  LuBan,
  LuPencil,
  LuLock,
  LuLockOpen,
  LuLoaderCircle,
  LuSearch,
  LuX,
  LuUser,
} from "react-icons/lu";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAvailableDates,
  useCourtInfo,
  useBulkUpdateCourtNames,
  useToggleBlockSlot,
  useBulkToggleBlock,
  useCourtModeChange,
  useBulkModeChange,
} from "@/hooks/api/director-hooks/useGameAssingments";

const CourtLists = ({ campData }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const campId = campData?.id;
  const [assignmentType, setAssignmentType] = useState("individual");
  const [slotOverrides, setSlotOverrides] = useState({});

  // Reset slot overrides on camp or date change
  useEffect(() => {
    setSlotOverrides({});
  }, [campId, selectedDate]);

  const handleToggleSlotMode = (slotId, currentMode) => {
    const activeMode = slotOverrides[slotId] || currentMode || assignmentType;
    const nextMode = activeMode === "crew" ? "individual" : "crew";

    setSlotOverrides((prev) => ({
      ...prev,
      [slotId]: nextMode,
    }));

    courtModeChangeMutation.mutate({ slotId, mode: nextMode });
  };

  const handleBulkModeToggle = (mode) => {
    setAssignmentType(mode);
    setSlotOverrides({});
    if (scheduleId) {
      bulkModeChangeMutation.mutate({ scheduleId, mode });
    }
  };

  const getSlotAssignmentType = (courtSlot) => {
    if (!courtSlot) return assignmentType;
    if (slotOverrides[courtSlot.slot_id]) return slotOverrides[courtSlot.slot_id];
    if (courtSlot.mode === "crew" || courtSlot.assignment_mode === "crew") return "crew";
    if (courtSlot.mode === "individual" || courtSlot.assignment_mode === "individual") return "individual";
    const assignments = courtSlot.assignments || [];
    const hasCrew = assignments.some((a) => a.type === "crew" || a.is_crew || a.crew_id);
    if (hasCrew) return "crew";
    const hasRefs = assignments.some((a) => a.type === "individual" || a.referee_id || a.id);
    if (hasRefs) return "individual";
    return assignmentType;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Editing state
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editValue, setEditValue] = useState("");
  // Separate refs for the desktop and mobile edit inputs — both layouts are
  // mounted in the DOM at once (one hidden via CSS), so a shared ref would
  // always point at the hidden input and break autofocus.
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // ── Hooks ──────────────────────────────────────────────────────
  const { data: initialData, isLoading: loadingInitial } = useAvailableDates(
    campData?.id,
  );

  const availableDates = useMemo(
    () => initialData?.available_dates || [],
    [initialData?.available_dates]
  );
  const availableLocations = useMemo(
    () => initialData?.available_locations || [],
    [initialData?.available_locations]
  );

  const { data, isLoading } = useCourtInfo(campData?.id, selectedDate);

    // Sync assignmentType with backend mode from API data
  useEffect(() => {
    const backendMode =
      data?.mode ||
      data?.active_mode ||
      data?.schedule?.mode ||
      data?.schedule?.active_mode;

    if (backendMode === "crew" || backendMode === "individual") {
      setAssignmentType(backendMode);
    }
  }, [
    data?.mode,
    data?.active_mode,
    data?.schedule?.mode,
    data?.schedule?.active_mode,
  ]);

  const courtHeaders = data?.court_headers || [];
  const maxReferees = data?.schedule?.max_referees_per_slot;
  const scheduleId = data?.schedule?.schedule_id;
  const timeSlots = useMemo(() => data?.time_slots || [], [data?.time_slots]);

  // ── React Query client for cache invalidation ────────────────
  const queryClient = useQueryClient();

  const [selectedPosition, setSelectedPosition] = useState(null);

  // ── Helper callbacks (defined before mutation hooks that reference them) ──
  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditValue("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
    setSelectedPosition(null);
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

  const courtModeChangeMutation = useCourtModeChange(
    campData?.id,
    selectedDate,
  );

  const bulkModeChangeMutation = useBulkModeChange(
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

  const matchesSearch = (assignments, searchVal) => {
    if (!searchVal) return true;
    const lower = searchVal.toLowerCase();
    return assignments?.some((a) => {
      if (a.referee_name && a.referee_name.toLowerCase().includes(lower)) return true;
      if (a.referee_email && a.referee_email.toLowerCase().includes(lower)) return true;
      if (a.email && a.email.toLowerCase().includes(lower)) return true;
      if (a.name && a.name.toLowerCase().includes(lower)) return true;
      if (a.crew_name && a.crew_name.toLowerCase().includes(lower)) return true;
      if (a.members && Array.isArray(a.members)) {
        return a.members.some((m) =>
          (m.referee_name && m.referee_name.toLowerCase().includes(lower)) ||
          (m.referee_email && m.referee_email.toLowerCase().includes(lower)) ||
          (m.email && m.email.toLowerCase().includes(lower)) ||
          (m.name && m.name.toLowerCase().includes(lower))
        );
      }
      return false;
    });
  };

  // ── Stats for the selected day / location ─────────────────────
  const totalSlots = timeSlots.reduce(
    (sum, slot) => sum + getFilteredCourtsForSlot(slot).length,
    0,
  );
  const assignedSlots = timeSlots.reduce(
    (sum, slot) =>
      sum +
      getFilteredCourtsForSlot(slot).filter(
        (court) => (court.assignments || []).length > 0,
      ).length,
    0,
  );
  const blockedSlots = timeSlots.reduce(
    (sum, slot) =>
      sum +
      getFilteredCourtsForSlot(slot).filter((court) => court.is_blocked).length,
    0,
  );
  const coverage = totalSlots ? Math.round((assignedSlots / totalSlots) * 100) : 0;

  const stats = [
    {
      label: "Courts",
      value: `${filteredCourtHeaders.length}`,
      icon: <LuLayoutGrid />,
    },
    {
      label: "Time Slots",
      value: `${timeSlots.length}`,
      icon: <LuClock />,
    },
    {
      label: "Assigned Slots",
      value: `${assignedSlots} / ${totalSlots}`,
      icon: <LuUsers />,
    },
    {
      label: "Blocked Slots",
      value: `${blockedSlots}`,
      icon: <LuBan />,
    },
  ];

  const startEditing = (courtIdentifier, currentName) => {
    setEditingSlotId(courtIdentifier);
    setEditValue(currentName || "");
    setTimeout(() => {
      // Focusing a hidden input is a no-op; the visible one receives focus.
      desktopInputRef.current?.focus();
      mobileInputRef.current?.focus();
    }, 0);
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

  const handleBoxClick = (court, timeSlot, position = null) => {
    if (court?.is_blocked) return;
    setSelectedCourt(court);
    setSelectedTimeSlot(timeSlot);
    setSelectedPosition(position);
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
      bulkToggleBlockMutation.mutate({
        scheduleId,
        date,
        start_time: time24h,
        action,
      });
    }
  };

  const handleUndoBlock = (slotId) => {
    toggleBlockMutation.mutate(slotId);
  };

  if (loadingInitial || isLoading) return <ScheduleSkeleton />;
  if (availableDates.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
          <LuCalendarDays />
        </span>
        <p className="mt-4 font-medium text-[#333]">No available dates</p>
        <p className="text-sm text-[#666] mt-1">
          Build a schedule first to start assigning courts.
        </p>
      </div>
    );

  return (
    <div className="w-full mt-6 mb-16">
      {/* ── Overview stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#666]">{stat.label}</p>
              <p className="text-sm font-medium text-[#333] truncate">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Schedule coverage ──────────────────────────────────── */}
      <div className="bg-white border border-border rounded-[10px] px-4 sm:px-5 py-3.5 mt-3 sm:mt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-[#666]">Schedule coverage</span>
          <span className="font-semibold text-[#333] whitespace-nowrap">
            {coverage}% filled
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* ── Location filter ────────────────────────────────────── */}
      {availableLocations.length > 1 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-[#666] uppercase tracking-wide mb-2">
            Location
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar">
            {availableLocations.map((loc) => {
              const active = selectedLocationId === loc.location_id;
              return (
                <button
                  key={loc.location_id}
                  onClick={() => handleLocationClick(loc.location_id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${active
                    ? "bg-primary border-primary text-white shadow-sm"
                    : "bg-white border-border text-[#333] hover:border-primary/60 hover:text-primary"
                    }`}
                >
                  <LuMapPin
                    className={`shrink-0 ${active ? "" : "text-primary"}`}
                    size={15}
                  />
                  <span className="max-w-44 truncate">{loc.address}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${active
                      ? "bg-white/20"
                      : "bg-gray-100 text-[#666]"
                      }`}
                  >
                    {loc.court_count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Date filter & Search ───────────────────────────────── */}
      <div className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#666] uppercase tracking-wide mb-2">
            Camp Day
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar">
            {availableDates.map((item) => {
              const active = activeFilter === item.formatted;
              return (
                <button
                  key={item.formatted}
                  onClick={() => handleDateClick(item)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${active
                    ? "bg-primary border-primary text-white shadow-sm"
                    : "bg-white border-border text-[#333] hover:border-primary/60 hover:text-primary"
                    }`}
                >
                  <LuCalendarDays
                    className={`shrink-0 ${active ? "" : "text-primary"}`}
                    size={15}
                  />
                  {item.formatted}
                </button>
              );
            })}
          </div>
        </div>

        {/* Switcher + Search Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 mb-2">
          {/* Segmented Assignment Mode Control */}
          <div className="bg-gray-100 p-0.5 rounded-full flex items-center shrink-0 border border-gray-200 shadow-sm self-start sm:self-auto">
            <button
              onClick={() => handleBulkModeToggle("individual")}
              disabled={bulkModeChangeMutation.isPending}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${assignmentType === "individual"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <LuUser size={13} />
              Individual Refs
            </button>
            <button
              onClick={() => handleBulkModeToggle("crew")}
              disabled={bulkModeChangeMutation.isPending}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${assignmentType === "crew"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <LuUsers size={13} className={assignmentType === "crew" ? "text-purple-600" : ""} />
              Crews Mode
            </button>
          </div>

          {/* Referee search input */}
          <div className="relative flex-1 sm:w-80 shrink-0">
            <input
              id="referee-search"
              type="text"
              placeholder="Search referee by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 pr-10 rounded-full placeholder-[#8E9093] outline-none text-black border border-[#e2e8f0] bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm shadow-sm"
            />
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <LuX className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop: court grid board (lg+) ────────────────────── */}
      <div className="hidden lg:block w-full border border-border rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-6">
        <div className="max-h-[85vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex border-b border-border bg-[#FAFAFA] sticky top-0 z-20">
              <div className="w-28 shrink-0 sticky left-0 bg-[#FAFAFA] z-30 border-r border-border px-4 py-4 flex items-center justify-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666]">
                  Time
                </span>
              </div>

              <div className="flex">
                {filteredCourtHeaders.map((court) => {
                  const isEditingThisCourt =
                    editingSlotId === court.court_number;

                  return (
                    <div
                      key={court.court_number}
                      className="shrink-0 w-64 px-4 py-3.5 text-center"
                    >
                      {isEditingThisCourt ? (
                        <div className="relative">
                          <input
                            ref={desktopInputRef}
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
                            className="w-full text-center text-sm font-semibold text-primary bg-white border border-primary/40 rounded-lg px-2 py-1.5 outline-none ring-2 ring-primary/20"
                            placeholder="Court name..."
                          />
                          <div className="absolute -bottom-5 left-0 right-0 text-[10px] text-gray-400 text-center pointer-events-none whitespace-nowrap">
                            Enter to save • Esc to cancel
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            startEditing(
                              court.court_number,
                              court.court_name ||
                              `Court ${court.court_number}`,
                            )
                          }
                          className="group inline-flex items-center gap-1.5 font-semibold text-[#333] hover:text-primary transition-colors cursor-pointer"
                          title="Click to edit court name (updates all time slots)"
                        >
                          <span className="truncate max-w-[180px]">
                            {court.court_name || `Court ${court.court_number}`}
                          </span>
                          <LuPencil className="opacity-0 group-hover:opacity-100 text-sm text-primary shrink-0 transition-opacity" />
                        </button>
                      )}

                      {!isEditingThisCourt && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {court.address}
                        </p>
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
                  className="flex border-b border-border last:border-b-0 hover:bg-primary/[0.02] transition-colors"
                >
                  <div className="w-28 shrink-0 sticky left-0 bg-white z-10 border-r border-border px-3 py-5 flex flex-col items-center justify-center gap-3">
                    <span className="text-sm font-semibold text-[#333]">
                      {slot.time}
                    </span>

                    <button
                      onClick={() =>
                        handleBulkBlock(slot.time_24h, selectedDate)
                      }
                      disabled={bulkToggleBlockMutation.isPending}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${allBlocked
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        }`}
                    >
                      {bulkToggleBlockMutation.isPending ? (
                        <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
                      ) : allBlocked ? (
                        <LuLockOpen className="w-3.5 h-3.5" />
                      ) : (
                        <LuLock className="w-3.5 h-3.5" />
                      )}
                      {bulkToggleBlockMutation.isPending
                        ? allBlocked
                          ? "Unblocking..."
                          : "Blocking..."
                        : allBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
                  </div>

                  <div className="flex gap-4 px-4 py-4">
                    {filteredCourts.map((court) => {
                      const isBlocked = court?.is_blocked;
                      const referees = court?.assignments || [];
                      const isDimmed = searchQuery && !matchesSearch(referees, searchQuery);

                      return (
                        <CourtSlotBox
                          key={court.slot_id}
                          court={court}
                          timeSlot={slot}
                          isBlocked={isBlocked}
                          referees={referees}
                          campId={campData?.id}
                          selectedDate={selectedDate}
                          maxReferees={maxReferees}
                          sportName={campData?.sport?.sports_name}
                          isDimmed={isDimmed}
                          searchQuery={searchQuery}
                          assignmentType={getSlotAssignmentType(court)}
                          onToggleSlotMode={handleToggleSlotMode}
                          onClick={handleBoxClick}
                          onUndoBlock={handleUndoBlock}
                          isBlockPending={toggleBlockMutation.isPending}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile: time-slot cards (<lg) ──────────────────────── */}
      <div className="lg:hidden space-y-4 mt-6">
        {timeSlots.map((slot) => {
          const filteredCourts = getFilteredCourtsForSlot(slot);
          const allBlocked = filteredCourts.every((court) => court.is_blocked);

          return (
            <div
              key={slot.time_24h}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Time slot header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-[#FAFAFA] border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <LuClock size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#333] leading-tight">
                      {slot.time}
                    </p>
                    <p className="text-xs text-[#666]">
                      {filteredCourts.length} court
                      {filteredCourts.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBulkBlock(slot.time_24h, selectedDate)}
                  disabled={bulkToggleBlockMutation.isPending}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer disabled:opacity-60 ${allBlocked
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-white text-red-500 border-red-200 hover:bg-red-50"
                    }`}
                >
                  {bulkToggleBlockMutation.isPending ? (
                    <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  ) : allBlocked ? (
                    <HiLockOpen className="w-3.5 h-3.5" />
                  ) : (
                    <HiLockClosed className="w-3.5 h-3.5" />
                  )}
                  {bulkToggleBlockMutation.isPending
                    ? allBlocked
                      ? "Unblocking..."
                      : "Blocking..."
                    : allBlocked
                      ? "Unblock all"
                      : "Block all"}
                </button>
              </div>

              {/* Courts */}
              <div className="divide-y divide-border">
                {filteredCourts.map((court) => {
                  const isDimmed = searchQuery && !matchesSearch(court?.assignments || [], searchQuery);
                  return (
                    <CourtSlotCardMobile
                      key={court.slot_id}
                      court={court}
                      timeSlot={slot}
                      isBlocked={court?.is_blocked}
                      campId={campData?.id}
                      selectedDate={selectedDate}
                      maxReferees={maxReferees}
                      sportName={campData?.sport?.sports_name}
                      isDimmed={isDimmed}
                      searchQuery={searchQuery}
                      assignmentType={getSlotAssignmentType(court)}
                      onToggleSlotMode={handleToggleSlotMode}
                      address={
                        filteredCourtHeaders.find(
                          (h) => h.court_number === court.court_number,
                        )?.address
                      }
                      onOpen={handleBoxClick}
                      onToggleBlock={handleUndoBlock}
                      isEditing={editingSlotId === court.court_number}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      inputRef={mobileInputRef}
                      isTogglePending={toggleBlockMutation.isPending}
                      onStartEdit={(name) =>
                        startEditing(court.court_number, name)
                      }
                      onSaveEdit={(locationId, courtNumber) =>
                        saveEditBulk(locationId, courtNumber)
                      }
                      onCancelEdit={cancelEdit}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ScheduleActionButtons campId={campData?.id} />

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        selectedTimeSlot={selectedTimeSlot}
        selectedPosition={selectedPosition}
        handleBlockCourt={handleBlockCourt}
        campId={campData?.id}
        maxReferees={maxReferees}
        selectedDate={selectedDate}
        sportName={campData?.sport?.sports_name}
        assignmentType={getSlotAssignmentType(selectedCourt)}
        isBlocking={toggleBlockMutation.isPending}
        onAssignSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default CourtLists;
