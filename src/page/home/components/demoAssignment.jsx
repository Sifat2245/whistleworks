import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuCalendarDays,
    LuLayoutGrid,
    LuUsers,
    LuPencil,
    LuLock,
    LuSearch,
    LuX,
    LuUser,
    LuRotateCcw,
    LuSparkles,
} from "react-icons/lu";
import { TiPlus } from "react-icons/ti";
import { HiXMark, HiLockClosed, HiLockOpen } from "react-icons/hi2";
import CommonTitle from "../../../components/common/CommonTitle";

// ── Initial Mock Data (Exact CourtAssignment Schema) ──────────────────────────

const INITIAL_COURTS = [
    { id: 1, court_number: 1, court_name: "Court 1", address: "Titumir College" },
    { id: 2, court_number: 2, court_name: "Court 2", address: "Titumir College" },
    { id: 3, court_number: 3, court_name: "Court 3", address: "Titumir College" },
    { id: 4, court_number: 4, court_name: "Court 4", address: "Titumir College" },
    { id: 5, court_number: 5, court_name: "Court 5", address: "Titumir College" },
];

const INITIAL_TIME_SLOTS = [
    { time_24h: "09:00", time: "09:00 AM" },
    { time_24h: "10:30", time: "10:30 AM" },
    { time_24h: "12:00", time: "12:00 PM" },
    { time_24h: "13:30", time: "01:30 PM" },
];

const DUMMY_REFEREES = [
    {
        id: 101,
        name: "Marcus Vance",
        jourcy_number: "12",
        phone: "+1 (555) 234-8901",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        total_assignments: 14,
        status: "available",
        status_message: "Available • Lead Referee",
    },
    {
        id: 102,
        name: "Sarah Jenkins",
        jourcy_number: "45",
        phone: "+1 (555) 456-7812",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        total_assignments: 18,
        status: "available",
        status_message: "Available • Umpire 1",
    },
    {
        id: 103,
        name: "David Rodriguez",
        jourcy_number: "08",
        phone: "+1 (555) 789-0123",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        total_assignments: 9,
        status: "needs_rest",
        status_message: "Needs Rest • 2 consecutive games worked",
    },
    {
        id: 104,
        name: "Elena Rostova",
        jourcy_number: "22",
        phone: "+1 (555) 321-6549",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        total_assignments: 21,
        status: "available",
        status_message: "Available • High Rating",
    },
    {
        id: 105,
        name: "Tyrone Jackson",
        jourcy_number: "33",
        phone: "+1 (555) 987-1234",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        total_assignments: 11,
        status: "time_conflict",
        status_message: "Assigned to another court at this time",
    },
];

const DUMMY_CREWS = [
    {
        id: "crew-alpha",
        name: "Alpha Officiating Crew",
        status: "active",
        member_count: 3,
        members: [
            { id: 101, name: "Marcus Vance", position: "Lead Referee" },
            { id: 102, name: "Sarah Jenkins", position: "Umpire 1" },
            { id: 104, name: "Elena Rostova", position: "Umpire 2" },
        ],
    },
    {
        id: "crew-metro",
        name: "Metro Officiating Trio",
        status: "active",
        member_count: 3,
        members: [
            { id: 103, name: "David Rodriguez", position: "Lead Referee" },
            { id: 105, name: "Tyrone Jackson", position: "Umpire 1" },
            { id: 101, name: "Marcus Vance", position: "Umpire 2" },
        ],
    },
];

const INITIAL_SLOT_MAP = {
    "09:00-1": {
        is_blocked: false,
        mode: "individual",
        assignments: [
            { id: 1, referee_id: 101, name: "Marcus Vance", jourcy_number: "12", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", pos_id: 1, pos_name: "REFEREE POSITION 1" },
            { id: 2, referee_id: 102, name: "Sarah Jenkins", jourcy_number: "45", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", pos_id: 2, pos_name: "REFEREE POSITION 2" },
        ],
    },
    "09:00-2": {
        is_blocked: false,
        mode: "crew",
        crew_assignment: DUMMY_CREWS[0],
        assignments: [],
    },
    "10:30-2": {
        is_blocked: true,
        mode: "individual",
        assignments: [],
    },
    "12:00-4": {
        is_blocked: true,
        mode: "individual",
        assignments: [],
    },
};

const DemoAssignment = () => {
    const [courts, setCourts] = useState(INITIAL_COURTS);
    const [slotMap, setSlotMap] = useState(INITIAL_SLOT_MAP);
    const [activeDate, setActiveDate] = useState("May 08");
    const [globalAssignmentType, setGlobalAssignmentType] = useState("individual");
    const [searchQuery, setSearchQuery] = useState("");

    const [editingCourtNum, setEditingCourtNum] = useState(null);
    const [editValue, setEditValue] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalCourt, setModalCourt] = useState(null);
    const [modalTimeSlot, setModalTimeSlot] = useState(null);
    const [modalPosition, setModalPosition] = useState(null);
    const [modalTab, setModalTab] = useState("referees");
    const [selectedReferees, setSelectedReferees] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState(null);
    const [modalSearchTerm, setModalSearchTerm] = useState("");

    const getSlotKey = (time24h, courtNumber) => `${time24h}-${courtNumber}`;

    const getSlotData = (time24h, courtNumber) => {
        const key = getSlotKey(time24h, courtNumber);
        return (
            slotMap[key] || {
                is_blocked: false,
                mode: globalAssignmentType,
                assignments: [],
                crew_assignment: null,
            }
        );
    };

    const handleResetDemo = () => {
        setCourts(INITIAL_COURTS);
        setSlotMap(INITIAL_SLOT_MAP);
        setGlobalAssignmentType("individual");
        setSearchQuery("");
    };

    const handleBulkModeToggle = (mode) => {
        setGlobalAssignmentType(mode);
    };

    const handleToggleSlotMode = (time24h, courtNumber) => {
        const key = getSlotKey(time24h, courtNumber);
        setSlotMap((prev) => {
            const current = prev[key] || { is_blocked: false, mode: globalAssignmentType, assignments: [] };
            const nextMode = current.mode === "crew" ? "individual" : "crew";
            return {
                ...prev,
                [key]: { ...current, mode: nextMode },
            };
        });
    };

    const handleUndoBlock = (time24h, courtNumber) => {
        const key = getSlotKey(time24h, courtNumber);
        setSlotMap((prev) => {
            const current = prev[key] || { is_blocked: true, mode: globalAssignmentType, assignments: [] };
            return {
                ...prev,
                [key]: { ...current, is_blocked: !current.is_blocked },
            };
        });
    };

    const handleBulkBlockRow = (time24h) => {
        const allBlocked = courts.every((c) => getSlotData(time24h, c.court_number).is_blocked);

        setSlotMap((prev) => {
            const next = { ...prev };
            courts.forEach((c) => {
                const key = getSlotKey(time24h, c.court_number);
                const current = next[key] || { mode: globalAssignmentType, assignments: [] };
                next[key] = { ...current, is_blocked: !allBlocked };
            });
            return next;
        });
    };

    const handleSaveCourtName = (courtNumber) => {
        if (!editValue.trim()) return;
        setCourts((prev) =>
            prev.map((c) => (c.court_number === courtNumber ? { ...c, court_name: editValue.trim() } : c))
        );
        setEditingCourtNum(null);
        setEditValue("");
    };

    const handleRemoveAssignment = (time24h, courtNumber, assignmentId) => {
        const key = getSlotKey(time24h, courtNumber);
        setSlotMap((prev) => {
            const current = prev[key];
            if (!current) return prev;
            return {
                ...prev,
                [key]: {
                    ...current,
                    crew_assignment: null,
                    assignments: current.assignments.filter((a) => a.id !== assignmentId && a.pos_id !== assignmentId),
                },
            };
        });
    };

    const handleOpenModal = (court, timeSlot, position = null) => {
        const data = getSlotData(timeSlot.time_24h, court.court_number);
        if (data.is_blocked) return;

        setModalCourt(court);
        setModalTimeSlot(timeSlot);
        setModalPosition(position);
        setModalTab(data.mode === "crew" ? "crew" : "referees");
        setModalSearchTerm("");
        setSelectedCrew(data.crew_assignment?.id || null);

        const initialRefs = data.assignments.map((a) => ({
            id: a.referee_id,
            name: a.name,
            jourcy_number: a.jourcy_number,
            avatar: a.avatar,
            assignedPositionId: a.pos_id,
        }));
        setSelectedReferees(initialRefs);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalCourt(null);
        setModalTimeSlot(null);
        setModalPosition(null);
    };

    const handleRefereeToggleInModal = (referee) => {
        if (referee.status === "time_conflict") return;

        setSelectedReferees((prev) => {
            const exists = prev.some((r) => r.id === referee.id);
            if (exists) return prev.filter((r) => r.id !== referee.id);

            if (prev.length >= 3) return prev;

            let targetPosId = null;
            if (modalPosition?.id && !prev.some((r) => r.assignedPositionId === modalPosition.id)) {
                targetPosId = modalPosition.id;
            } else {
                const usedPosIds = prev.map((r) => r.assignedPositionId);
                targetPosId = [1, 2, 3].find((posId) => !usedPosIds.includes(posId)) || prev.length + 1;
            }

            return [...prev, { ...referee, assignedPositionId: targetPosId }];
        });
    };

    const handlePositionChangeForReferee = (refId, newPosId) => {
        setSelectedReferees((prev) => {
            const currentRef = prev.find((r) => r.id === refId);
            if (!currentRef) return prev;
            const oldPosId = currentRef.assignedPositionId;

            const occupant = prev.find((r) => r.assignedPositionId === newPosId && r.id !== refId);

            return prev.map((r) => {
                if (r.id === refId) return { ...r, assignedPositionId: newPosId };
                if (occupant && r.id === occupant.id) return { ...r, assignedPositionId: oldPosId };
                return r;
            });
        });
    };

    const handlePrimaryModalAction = () => {
        if (!modalCourt || !modalTimeSlot) return;
        const key = getSlotKey(modalTimeSlot.time_24h, modalCourt.court_number);

        if (modalTab === "crew") {
            const matchedCrew = DUMMY_CREWS.find((c) => c.id === selectedCrew);
            setSlotMap((prev) => ({
                ...prev,
                [key]: {
                    is_blocked: false,
                    mode: "crew",
                    crew_assignment: matchedCrew,
                    assignments: [],
                },
            }));
            handleCloseModal();
            return;
        }

        const assignments = selectedReferees.map((r) => ({
            id: r.id,
            referee_id: r.id,
            name: r.name,
            jourcy_number: r.jourcy_number,
            avatar: r.avatar,
            pos_id: r.assignedPositionId,
            pos_name: `REFEREE POSITION ${r.assignedPositionId}`,
        }));

        setSlotMap((prev) => ({
            ...prev,
            [key]: {
                is_blocked: false,
                mode: "individual",
                crew_assignment: null,
                assignments,
            },
        }));

        handleCloseModal();
    };

    const filteredModalReferees = useMemo(() => {
        if (!modalSearchTerm.trim()) return DUMMY_REFEREES;
        const lower = modalSearchTerm.toLowerCase();
        return DUMMY_REFEREES.filter(
            (r) => r.name.toLowerCase().includes(lower) || r.jourcy_number.includes(lower)
        );
    }, [modalSearchTerm]);

    return (
        <section className="py-16 md:py-24 bg-white text-[#333] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="absolute inset-0 bg-[radial-gradient(#00AEEF_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-[0.10] pointer-events-none [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]" />

            <motion.div
                className="absolute top-12 left-1/4 w-[28rem] h-[28rem] bg-sky-300/20 rounded-full blur-[110px] pointer-events-none"
                animate={{
                    x: [0, 40, -30, 0],
                    y: [0, -20, 20, 0],
                    scale: [1, 1.08, 0.95, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-1/3 -right-10 w-[30rem] h-[30rem] bg-indigo-300/15 rounded-full blur-[120px] pointer-events-none"
                animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 30, -20, 0],
                    scale: [1, 0.92, 1.05, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-12 left-1/3 w-80 h-80 bg-cyan-200/30 rounded-full blur-[95px] pointer-events-none"
                animate={{
                    x: [0, 30, -40, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                        <LuSparkles className="text-primary text-xs animate-pulse" />
                        <span>Live Interactive Demo</span>
                    </div>

                    <CommonTitle
                        text="Interactive Court Assignment Experience"
                        className="text-[#333] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
                    />

                    <p className="mt-3 text-[#666] text-base sm:text-lg leading-relaxed">
                        Hands-on demonstration of Whistle Works&apos; referee court assignment system. Try clicking slots, assigning referees or crews, blocking slots, and switching modes!
                    </p>
                </div>

                <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#666] uppercase tracking-wide mb-2">
                                Camp Day
                            </p>
                            <div className="flex gap-2">
                                {["May 08", "May 09"].map((day) => {
                                    const active = activeDate === day;
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => setActiveDate(day)}
                                            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${active
                                                    ? "bg-primary border-primary text-white shadow-sm ring-2 ring-primary/20"
                                                    : "bg-white/90 backdrop-blur-sm border-border text-[#333] hover:border-primary/60 hover:text-primary"
                                                }`}
                                        >
                                            <LuCalendarDays className={`shrink-0 ${active ? "" : "text-primary"}`} size={15} />
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 mb-2">
                            <button
                                onClick={handleResetDemo}
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#333] hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs"
                                title="Reset demo data"
                            >
                                <LuRotateCcw size={13} className="text-primary" />
                                <span>Reset Demo</span>
                            </button>

                            <div className="bg-gray-100/90 backdrop-blur-sm p-0.5 rounded-full flex items-center shrink-0 border border-gray-200 shadow-sm self-start sm:self-auto">
                                <button
                                    onClick={() => handleBulkModeToggle("individual")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${globalAssignmentType === "individual"
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    <LuUser size={13} />
                                    Individual Refs
                                </button>
                                <button
                                    onClick={() => handleBulkModeToggle("crew")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${globalAssignmentType === "crew"
                                            ? "bg-white text-purple-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    <LuUsers size={13} className={globalAssignmentType === "crew" ? "text-purple-600" : ""} />
                                    Crews Mode
                                </button>
                            </div>

                            <div className="relative flex-1 sm:w-72 shrink-0">
                                <input
                                    type="text"
                                    placeholder="Search referee by name, email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 pl-10 pr-10 rounded-full placeholder-[#8E9093] outline-none text-black border border-[#e2e8f0] bg-white/95 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm shadow-sm"
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

                    <div className="hidden lg:block w-full border border-sky-100/80 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md shadow-[0_15px_45px_rgba(0,174,239,0.06)] mt-6">
                        <div className="max-h-[85vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
                            <div className="min-w-max">
                                <div className="flex border-b border-border bg-[#FAFAFA] sticky top-0 z-20">
                                    <div className="w-28 shrink-0 sticky left-0 bg-[#FAFAFA] z-30 border-r border-border px-4 py-4 flex items-center justify-center">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666]">
                                            Time
                                        </span>
                                    </div>

                                    <div className="flex">
                                        {courts.map((court) => {
                                            const isEditing = editingCourtNum === court.court_number;
                                            return (
                                                <div key={court.court_number} className="shrink-0 w-64 px-4 py-3.5 text-center border-r border-border/40 last:border-r-0">
                                                    {isEditing ? (
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") handleSaveCourtName(court.court_number);
                                                                    if (e.key === "Escape") setEditingCourtNum(null);
                                                                }}
                                                                autoFocus
                                                                className="w-full text-center text-sm font-semibold text-primary bg-white border border-primary/40 rounded-lg px-2 py-1.5 outline-none ring-2 ring-primary/20"
                                                                placeholder="Court name..."
                                                            />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingCourtNum(court.court_number);
                                                                setEditValue(court.court_name);
                                                            }}
                                                            className="group inline-flex items-center gap-1.5 font-semibold text-[#333] hover:text-primary transition-colors cursor-pointer"
                                                            title="Click to edit court name"
                                                        >
                                                            <span className="truncate max-w-[180px]">{court.court_name}</span>
                                                            <LuPencil className="opacity-0 group-hover:opacity-100 text-sm text-primary shrink-0 transition-opacity" />
                                                        </button>
                                                    )}
                                                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{court.address}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {INITIAL_TIME_SLOTS.map((slot) => {
                                    const allBlocked = courts.every(
                                        (c) => getSlotData(slot.time_24h, c.court_number).is_blocked
                                    );

                                    return (
                                        <div
                                            key={slot.time_24h}
                                            className="flex border-b border-border last:border-b-0 hover:bg-primary/[0.02] transition-colors"
                                        >
                                            <div className="w-28 shrink-0 sticky left-0 bg-white z-10 border-r border-border px-3 py-5 flex flex-col items-center justify-center gap-3">
                                                <span className="text-sm font-semibold text-[#333]">{slot.time}</span>
                                                <button
                                                    onClick={() => handleBulkBlockRow(slot.time_24h)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${allBlocked
                                                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                                        }`}
                                                >
                                                    {allBlocked ? <HiLockOpen className="w-3.5 h-3.5" /> : <HiLockClosed className="w-3.5 h-3.5" />}
                                                    {allBlocked ? "Unblock" : "Block"}
                                                </button>
                                            </div>

                                            <div className="flex gap-4 px-4 py-4">
                                                {courts.map((court) => {
                                                    const data = getSlotData(slot.time_24h, court.court_number);
                                                    const isBlocked = data.is_blocked;
                                                    const hasCrew = !!data.crew_assignment;
                                                    const crewObj = data.crew_assignment;
                                                    const slotMode = data.mode || globalAssignmentType;

                                                    const courtPositions = [
                                                        { id: 1, position: "REFEREE POSITION 1" },
                                                        { id: 2, position: "REFEREE POSITION 2" },
                                                    ];

                                                    const assignedCount = data.assignments.length;

                                                    return (
                                                        <div
                                                            key={court.court_number}
                                                            onClick={() => !isBlocked && handleOpenModal(court, slot)}
                                                            className={`shrink-0 w-64 rounded-xl border bg-white p-4 min-h-[230px] flex flex-col justify-between transition-all duration-300 ${isBlocked
                                                                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                                                    : "border-border cursor-pointer hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                                                                }`}
                                                        >
                                                            {isBlocked ? (
                                                                <div className="flex flex-col items-center justify-center gap-3 py-4 w-full h-full my-auto">
                                                                    <span className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                                                        <LuLock size={20} />
                                                                    </span>
                                                                    <p className="text-sm font-medium text-gray-400">Blocked</p>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUndoBlock(slot.time_24h, court.court_number);
                                                                        }}
                                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                                                    >
                                                                        Unblock slot
                                                                    </button>
                                                                </div>
                                                            ) : hasCrew ? (
                                                                <div className="w-full text-center my-auto">
                                                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
                                                                        <LuUsers size={12} /> Crew Assigned
                                                                    </span>

                                                                    <p className="font-bold text-lg text-[#333] mt-3 truncate">
                                                                        {crewObj.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                                        {crewObj.member_count} members
                                                                    </p>

                                                                    <div className="max-h-40 overflow-y-auto w-full mt-3 space-y-1.5 text-left">
                                                                        {crewObj.members.map((member, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 bg-gray-50 border border-border text-xs"
                                                                            >
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="text-[9px] font-bold uppercase text-primary leading-none">
                                                                                        {member.position}
                                                                                    </p>
                                                                                    <span className="text-xs font-semibold text-[#333] truncate block mt-0.5">
                                                                                        {member.name}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveAssignment(slot.time_24h, court.court_number, crewObj.id);
                                                                        }}
                                                                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                                                    >
                                                                        Remove crew
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="w-full flex flex-col h-full justify-between">
                                                                    <div className="flex items-center justify-between mb-3 shrink-0">
                                                                        <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
                                                                            {slotMode === "crew" ? "Crew Assignment" : "Positions"}
                                                                        </span>

                                                                        {assignedCount === 0 ? (
                                                                            <div className="bg-gray-100 p-0.5 rounded-full flex items-center shrink-0 border border-gray-200">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleToggleSlotMode(slot.time_24h, court.court_number);
                                                                                    }}
                                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${slotMode === "individual"
                                                                                            ? "bg-white text-primary shadow-sm"
                                                                                            : "text-gray-400 hover:text-gray-600"
                                                                                        }`}
                                                                                    title="Switch to Individual Referees"
                                                                                >
                                                                                    <LuUser size={13} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleToggleSlotMode(slot.time_24h, court.court_number);
                                                                                    }}
                                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${slotMode === "crew"
                                                                                            ? "bg-white text-primary shadow-sm"
                                                                                            : "text-gray-400 hover:text-gray-600"
                                                                                        }`}
                                                                                    title="Switch to Crew Mode"
                                                                                >
                                                                                    <LuUsers size={13} />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                                                {assignedCount}/{courtPositions.length}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {slotMode === "crew" ? (
                                                                        <div className="flex flex-col items-center justify-center gap-3 py-6 flex-1 w-full my-auto">
                                                                            <button className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer">
                                                                                <TiPlus className="text-3xl" />
                                                                            </button>
                                                                            <p className="text-xs text-gray-400">Tap to assign crew</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                                                                            {courtPositions.map((pos) => {
                                                                                const assignedRef = data.assignments.find((a) => a.pos_id === pos.id);

                                                                                if (assignedRef) {
                                                                                    return (
                                                                                        <div
                                                                                            key={pos.id}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleOpenModal(court, slot, pos);
                                                                                            }}
                                                                                            className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 border border-border bg-gray-50 hover:border-primary/30 transition-all cursor-pointer"
                                                                                        >
                                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                                <img
                                                                                                    src={assignedRef.avatar}
                                                                                                    alt={assignedRef.name}
                                                                                                    className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                                                                                                />
                                                                                                <div className="min-w-0">
                                                                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">
                                                                                                        {pos.position}
                                                                                                    </p>
                                                                                                    <p className="text-xs font-semibold text-[#333] truncate mt-0.5 leading-tight">
                                                                                                        {assignedRef.name}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1">
                                                                                                    #{assignedRef.jourcy_number}
                                                                                                </span>
                                                                                            </div>

                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    handleRemoveAssignment(slot.time_24h, court.court_number, assignedRef.id);
                                                                                                }}
                                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
                                                                                            >
                                                                                                <HiXMark className="w-3.5 h-3.5" />
                                                                                            </button>
                                                                                        </div>
                                                                                    );
                                                                                }

                                                                                return (
                                                                                    <div
                                                                                        key={pos.id}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleOpenModal(court, slot, pos);
                                                                                        }}
                                                                                        className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-gray-200 px-2.5 py-2 hover:border-primary/50 hover:bg-primary/[0.01] transition-all group/empty cursor-pointer"
                                                                                    >
                                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                                            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 group-hover/empty:text-primary group-hover/empty:bg-primary/10 transition-colors">
                                                                                                <TiPlus className="text-sm" />
                                                                                            </span>
                                                                                            <div className="min-w-0">
                                                                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 group-hover/empty:text-primary transition-colors leading-none">
                                                                                                    {pos.position}
                                                                                                </p>
                                                                                                <p className="text-[11px] text-gray-400/80 leading-none mt-1">
                                                                                                    Unassigned
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="text-[10px] font-semibold text-primary opacity-0 group-hover/empty:opacity-100 transition-opacity shrink-0">
                                                                                            Assign
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
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
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white border border-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-[#333] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-5 bg-white border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
                                        <LuLayoutGrid size={20} />
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#333] leading-tight">
                                            Assign to {modalCourt?.court_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {modalTimeSlot?.time} • {modalCourt?.address || "Main Court"}
                                            {modalPosition && (
                                                <span className="ml-2 font-semibold text-primary">
                                                    • Target: {modalPosition.position}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <LuX size={16} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-5 flex-1">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setModalTab("referees")}
                                        className={`px-5 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${modalTab === "referees"
                                                ? "border-primary text-primary"
                                                : "border-transparent text-gray-500 hover:text-gray-800"
                                            }`}
                                    >
                                        Assign Referees
                                    </button>
                                    <button
                                        onClick={() => setModalTab("crew")}
                                        className={`px-5 py-2.5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${modalTab === "crew"
                                                ? "border-purple-600 text-purple-600"
                                                : "border-transparent text-gray-500 hover:text-gray-800"
                                            }`}
                                    >
                                        Assign Crew
                                    </button>
                                </div>

                                {modalTab === "referees" ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                                                    Court Positions ({selectedReferees.length}/3)
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {[1, 2, 3].map((posId) => {
                                                    const assignedRef = selectedReferees.find((r) => r.assignedPositionId === posId);
                                                    return (
                                                        <div
                                                            key={posId}
                                                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${assignedRef
                                                                    ? "bg-white border-blue-200 shadow-sm"
                                                                    : "bg-white/60 border-dashed border-gray-300 hover:border-primary cursor-pointer"
                                                                }`}
                                                        >
                                                            {assignedRef ? (
                                                                <>
                                                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                                        <img
                                                                            src={assignedRef.avatar}
                                                                            alt={assignedRef.name}
                                                                            className="w-9 h-9 rounded-full object-cover border border-blue-200 shrink-0"
                                                                        />
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
                                                                                POSITION {posId}
                                                                            </span>
                                                                            <span className="text-xs font-semibold text-gray-800 truncate">
                                                                                {assignedRef.name}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleRefereeToggleInModal(assignedRef)}
                                                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shrink-0"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium py-0.5">
                                                                    <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm font-bold">
                                                                        +
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                                            POSITION {posId}
                                                                        </span>
                                                                        <span className="text-[11px] text-gray-400">Unassigned</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={modalSearchTerm}
                                                onChange={(e) => setModalSearchTerm(e.target.value)}
                                                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                        </div>

                                        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                                            {filteredModalReferees.map((ref) => {
                                                const selectedObj = selectedReferees.find((r) => r.id === ref.id);
                                                const isSelected = !!selectedObj;
                                                const isConflict = ref.status === "time_conflict";
                                                const isNeedsRest = ref.status === "needs_rest";

                                                return (
                                                    <div
                                                        key={ref.id}
                                                        onClick={() => handleRefereeToggleInModal(ref)}
                                                        className={`border rounded-2xl p-4 flex flex-col transition-all cursor-pointer ${isSelected
                                                                ? isNeedsRest
                                                                    ? "border-orange-400 bg-orange-50/80 ring-2 ring-orange-200 shadow-md"
                                                                    : "border-primary bg-blue-50/70 shadow-md ring-2 ring-primary/20"
                                                                : isConflict
                                                                    ? "border-red-400 bg-red-50 opacity-60 cursor-not-allowed"
                                                                    : isNeedsRest
                                                                        ? "border-orange-300 bg-orange-50/60 hover:border-orange-400"
                                                                        : "border-gray-200 hover:border-primary"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <img
                                                                    src={ref.avatar}
                                                                    alt={ref.name}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <p className="font-semibold text-gray-900">
                                                                            {ref.name} #{ref.jourcy_number}
                                                                        </p>
                                                                        {isNeedsRest && (
                                                                            <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                                                                                Needs Rest
                                                                            </span>
                                                                        )}
                                                                        {isConflict && (
                                                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                                                Conflicting Assignment
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-500 mt-0.5">Contact: {ref.phone}</p>
                                                                    <p className="text-xs font-semibold text-gray-500">
                                                                        Total Games Assigned: {ref.total_assignments}
                                                                    </p>
                                                                    <p className={`text-xs mt-1 font-medium ${isConflict ? "text-red-600" : isNeedsRest ? "text-orange-600" : "text-green-600"}`}>
                                                                        {ref.status_message}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                readOnly
                                                                className="w-5 h-5 rounded text-primary focus:ring-2"
                                                            />
                                                        </div>

                                                        {isSelected && (
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="mt-3 pt-3 border-t border-blue-200/60 flex flex-wrap items-center gap-2"
                                                            >
                                                                <span className="text-xs font-semibold text-gray-600 mr-1">
                                                                    Assign Position:
                                                                </span>
                                                                {[1, 2, 3].map((posId) => {
                                                                    const isThisPos = selectedObj?.assignedPositionId === posId;
                                                                    return (
                                                                        <button
                                                                            key={posId}
                                                                            onClick={() => handlePositionChangeForReferee(ref.id, posId)}
                                                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${isThisPos
                                                                                    ? "bg-primary text-white shadow-md ring-2 ring-primary/30"
                                                                                    : "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                                                                                }`}
                                                                        >
                                                                            <span>POS {posId}</span>
                                                                            {isThisPos && <span className="text-white text-[11px] font-bold">✓</span>}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            Select one pre-made crew to assign all its members to this time slot.
                                        </p>

                                        {DUMMY_CREWS.map((crew) => {
                                            const isSelected = selectedCrew === crew.id;
                                            return (
                                                <div
                                                    key={crew.id}
                                                    onClick={() => setSelectedCrew(isSelected ? null : crew.id)}
                                                    className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${isSelected
                                                            ? "border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-500/20"
                                                            : "border-gray-200 hover:border-purple-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-lg text-gray-900">{crew.name}</h4>
                                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                                            {crew.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{crew.member_count} members</p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {crew.members.map((m, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-white border border-purple-200 text-purple-800 px-2.5 py-1 rounded-lg font-semibold"
                                                            >
                                                                {m.name} ({m.position})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-5 bg-gray-50 border-t border-border flex items-center justify-between">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePrimaryModalAction}
                                    disabled={modalTab === "referees" ? selectedReferees.length === 0 : !selectedCrew}
                                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-white text-white hover:text-slate-900 border border-primary hover:border-slate-300 disabled:opacity-50 font-bold text-sm transition-all shadow-md cursor-pointer"
                                >
                                    {modalTab === "referees"
                                        ? `Assign Referees (${selectedReferees.length}/3)`
                                        : "Assign Selected Crew"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default DemoAssignment;
