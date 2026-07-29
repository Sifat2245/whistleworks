import { useEffect } from "react";
import { Modal, Skeleton } from "antd";

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

  return (
    <Modal
      title={<span className="text-2xl font-semibold">Court Schedule Details</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={960}
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
          <div className="flex-1 space-y-5 p-6 border border-black/15 rounded-lg bg-white text-lg">
            <p>
              <strong>Status:</strong>{" "}
              <span className="ml-2 font-medium">{scheduleData.status}</span>
            </p>
            <p>
              <strong>Game Duration:</strong>{" "}
              <span className="ml-2">{scheduleData.game_duration} minutes</span>
            </p>
            <p>
              <strong>Total Game Slots:</strong>{" "}
              <span className="ml-2">{scheduleData.total_game_slots}</span>
            </p>
            <p>
              <strong>Referees per slot:</strong>{" "}
              <span className="ml-2">{scheduleData.max_referees_per_slot} Referees</span>
            </p>
            <p>
              <strong>Assigned Slots:</strong>{" "}
              <span className="ml-2">{scheduleData.assigned_slots}</span>
            </p>
            <p>
              <strong>Available Slots:</strong>{" "}
              <span className="ml-2 text-primary font-semibold">
                {scheduleData.available_slots}
              </span>
            </p>
            <p>
              <strong>Blocked Slots:</strong>{" "}
              <span className="ml-2 text-red-600 font-semibold">
                {scheduleData.blocked_slots}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              <span className="ml-2 text-gray-600">
                {new Date(scheduleData.created_at).toLocaleString()}
              </span>
            </p>
          </div>

          {/* Right Side - Time Ranges with Fixed Height & Vertical Scroll */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Available Time Ranges
            </h3>
            <div
              className="flex-1 space-y-3 overflow-y-auto pr-2 border border-black/15 rounded-lg p-4 bg-gray-50/50
                         scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              style={{ maxHeight: "360px" }} 
            >
              {scheduleData.time_ranges?.length > 0 ? (
                scheduleData.time_ranges.map((range, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-black/10 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <p className="font-medium text-gray-900">
                      {range.formatted_date}
                    </p>
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Start Time:</strong> {range.start_time}
                      </p>
                      <p>
                        <strong>End Time:</strong> {range.end_time}
                      </p>
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