import { useState, useEffect } from "react";
import { Modal } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { FaShield } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const ScheduleAddModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  handleBlockCourt,
  handleRefereeUpdate,
  existingReferees,
  campId,
}) => {
  const [selectedReferees, setSelectedReferees] = useState([]);
  const axiosInstance = useAxiosSecure();

  const { data: refereeListData } = useQuery({
    queryKey: ["referee-list"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/director/court-assign/camp/${campId}/available-referees`
      );
      return response?.data?.data?.referees;
    },
  });
  console.log(refereeListData, "referees");

  useEffect(() => {
    // Initialize with existing referees when modal opens
    if (isModalOpen) {
      setSelectedReferees(existingReferees);
    }
  }, [isModalOpen, existingReferees]);

  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const isSelected = prev.find((r) => r.id === referee.id);

      if (isSelected) {
        // Remove referee if already selected
        return prev.filter((r) => r.id !== referee.id);
      } else {
        // Add referee if not selected and less than 3
        if (prev.length < 3) {
          return [...prev, referee];
        }
        return prev;
      }
    });
  };

  const handleUpdate = () => {
    handleRefereeUpdate(selectedReferees);
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  return (
    <div className="w-ful">
      <Modal
        title={`Add Schedule - ${selectedCourt?.court} (${selectedTimeSlot?.time})`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        className="min-w-[750px]"
        style={{ top: 20 }}
        centered
      >
        <div className="space-y-4 mt-6">
          {/* search option */}
          <div className="w-full flex gap-5 items-center justify-between">
            <input
              type="text"
              placeholder="Search referees..."
              className="w-full border border-border py-2 px-4 text-[#333] text-base rounded-md outline-0"
            />

            <CommonSubmitBtn className={"h-[41.8px]"}>Search</CommonSubmitBtn>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[#333] text-lg font-medium">Referees</p>
            <p className="text-sm text-gray-500">
              Selected: {selectedReferees.length}/3
            </p>
          </div>

          {/* referee select list and checkbox*/}
          <div className="w-full grid grid-cols-1 gap-4">
            {refereeListData?.map((referee) => {
              const isSelected = selectedReferees.find(
                (r) => r.id === referee.id
              );
              const isDisabled = !isSelected && selectedReferees.length >= 3;

              return (
                <div
                  key={referee.id}
                  // Make entire card clickable
                  onClick={() => {
                    if (!isDisabled) {
                      handleRefereeToggle(referee);
                    }
                  }}
                  className={`w-full flex items-center justify-between border rounded-lg py-3 px-4 transition-all cursor-pointer
          ${
            isSelected
              ? "border-[#00AEEF] bg-blue-50 shadow-sm"
              : isDisabled
              ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
              : "border-border hover:border-[#00AEEF] hover:bg-blue-50/30"
          }`}
                >
                  {/* Left: Avatar + Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="size-10 shrink-0 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={referee?.avatar || "/default-avatar.png"}
                        alt={referee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[#333] text-base font-medium">
                      {referee?.name}
                    </p>
                  </div>

                  {/* Right: Checkbox */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRefereeToggle(referee)}
                      disabled={isDisabled}
                      className="cursor-pointer size-5 accent-[#00AEEF] rounded"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* cancel, no game and update buttons */}
          <div className="w-full flex items-center justify-between pt-4">
            <CommonSubmitBtn variant="secondary" onClick={handleCancel}>
              Cancel
            </CommonSubmitBtn>

            <CommonSubmitBtn onClick={handleBlockCourt} variant="secondary">
              <FaShield className="text-lg mr-1.5" />
              Block this court
            </CommonSubmitBtn>

            <CommonSubmitBtn
              onClick={handleUpdate}
              disabled={selectedReferees.length === 0}
            >
              Update ({selectedReferees.length}/3)
            </CommonSubmitBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ScheduleAddModal;
