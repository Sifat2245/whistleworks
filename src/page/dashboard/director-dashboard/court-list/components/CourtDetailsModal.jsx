import { useEffect } from "react";
import { Modal, Skeleton } from "antd";
import {
  LuClock,
  LuCalendarDays,
  LuLayoutGrid,
  LuUsers,
  LuCircleCheck,
  LuLock,
  LuBan,
  LuInfo,
  LuCalendarRange,
} from "react-icons/lu";

// Modal Component using Ant Design
export const CourtDetailsModal = ({ scheduleData, isLoading, onClose, open }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const statusBadge = (status = "") => {
    const key = status.toLowerCase();
    if (key.includes("publish")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (key.includes("draft")) {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  const stats = scheduleData
    ? [
        {
          label: "Game Duration",
          value: `${scheduleData.game_duration} min`,
          icon: <LuClock />,
        },
        {
          label: "Total Game Slots",
          value: `${scheduleData.total_game_slots}`,
          icon: <LuLayoutGrid />,
        },
        {
          label: "Referees / Slot",
          value: `${scheduleData.max_referees_per_slot}`,
          icon: <LuUsers />,
        },
        {
          label: "Assigned Slots",
          value: `${scheduleData.assigned_slots}`,
          icon: <LuCircleCheck />,
          valueClass: "text-green-600",
        },
        {
          label: "Available Slots",
          value: `${scheduleData.available_slots}`,
          icon: <LuLock />,
          valueClass: "text-primary",
        },
        {
          label: "Blocked Slots",
          value: `${scheduleData.blocked_slots}`,
          icon: <LuBan />,
          valueClass: "text-red-600",
        },
      ]
    : [];

  return (
    <Modal
      title={<span className="text-2xl font-semibold">Court Schedule Details</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(960px, 94vw)"
      centered
      closeIcon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      }
      className="court-details-modal"
      styles={{
        body: { padding: "24px", maxHeight: "80vh", overflow: "hidden" },
      }}
    >
      {isLoading ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Skeleton */}
          <div className="flex-1 space-y-4">
            <Skeleton active paragraph={{ rows: 7 }} title={false} />
          </div>
          {/* Right Skeleton */}
          <div className="flex-1 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: "60%" }} />
              </div>
            ))}
          </div>
        </div>
      ) : !scheduleData ? (
        <div className="text-center py-12 text-gray-500 text-lg">
          No schedule data available.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 max-h-full">
          {/* Left Side - Stats */}
          <div className="flex-1 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-white border border-border text-primary flex items-center justify-center text-lg shrink-0">
                  <LuInfo />
                </span>
                <div>
                  <p className="text-xs text-[#666]">Status</p>
                  <p className="text-sm font-semibold text-[#333] capitalize">
                    {scheduleData.status}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${statusBadge(scheduleData.status)}`}
              >
                {scheduleData.status}
              </span>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3.5 border border-border rounded-xl bg-white flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">
                    {stat.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#666] truncate">{stat.label}</p>
                    <p
                      className={`text-sm font-semibold text-[#333] truncate ${
                        stat.valueClass || ""
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Created at */}
            <div className="flex items-center gap-3 p-3.5 border border-border rounded-xl bg-white">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">
                <LuCalendarRange />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-[#666]">Created At</p>
                <p className="text-sm font-medium text-[#333] truncate">
                  {new Date(scheduleData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Time Ranges with Fixed Height & Vertical Scroll */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">
                <LuCalendarDays />
              </span>
              <h3 className="text-lg font-semibold text-[#333]">
                Available Time Ranges
              </h3>
            </div>
            <div
              className="flex-1 space-y-3 overflow-y-auto pr-2 border border-border rounded-xl p-4 bg-[#FAFAFA]
                         scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              style={{ maxHeight: "360px" }}
            >
              {scheduleData.time_ranges?.length > 0 ? (
                scheduleData.time_ranges.map((range, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-border rounded-xl hover:shadow-sm hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[#333]">
                      <LuCalendarDays className="text-primary shrink-0" size={15} />
                      <p className="font-medium">{range.formatted_date}</p>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 text-sm text-gray-600">
                      <LuClock className="text-[#999] shrink-0" size={14} />
                      <span>
                        <strong className="text-[#333]">{range.start_time}</strong>
                        <span className="mx-1.5 text-gray-400">→</span>
                        <strong className="text-[#333]">{range.end_time}</strong>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-8">
                  No time ranges defined.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
