import { useState, useEffect } from "react";
import { Modal } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { FaShield } from "react-icons/fa6";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ScheduleAddModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  handleBlockCourt,
  onAssignSuccess,
  existingReferees,
  campId,
}) => {
  const [selectedReferees, setSelectedReferees] = useState([]);
  const axiosInstance = useAxiosSecure();

  // ---------------- GET REFEREES ----------------
  const { data: refereeListData } = useQuery({
    queryKey: ["referee-list", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/camp/${campId}/available-referees`
      );
      return res?.data?.data?.referees || [];
    },
    enabled: !!campId,
  });

  useEffect(() => {
    if (isModalOpen) {
      setSelectedReferees(existingReferees || []);
    }
  }, [isModalOpen, existingReferees]);

  // ---------------- TOGGLE ----------------
  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) return prev.filter((r) => r.id !== referee.id);
      if (prev.length < 3) return [...prev, referee];
      return prev;
    });
  };

  // ---------------- REFEREE ASSIGN API ----------------
  const assignMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      selectedReferees.forEach((ref) =>
        formData.append("referee_ids[]", ref.id)
      );

      const res = await axiosInstance.post(
        `/v1/director/court-assign/slot/${selectedCourt?.slot_id}/assign-individual`,
        formData
      );
      return res?.data;
    },

    onSuccess: (data) => {
      // success toast
      if (data?.data?.assigned_referees?.length > 0) {
        toast.success(data.message);
        onAssignSuccess(
          selectedCourt.slot_id,
          data.data.assigned_referees
        );
        handleCloseModal();
      }

      // warning toast for errors
      if (data?.data?.errors?.length > 0) {
        data.data.errors.forEach((err) => toast.error(err));
      }
    },

    onError: () => {
      toast.error("Failed to assign referees");
    },
  });

  // ---------------- UI ----------------
  return (
    <Modal
      title={`Add Schedule - Court ${selectedCourt?.court_number} (${selectedTimeSlot?.time})`}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      centered
      className="min-w-[750px]"
    >
      <div className="space-y-4 mt-6">
        <div className="flex justify-between">
          <p className="font-medium">Referees</p>
          <p className="text-sm text-gray-500">
            Selected: {selectedReferees.length}/3
          </p>
        </div>

        <div className="grid gap-4">
          {refereeListData?.map((ref) => {
            const isSelected = selectedReferees.some((r) => r.id === ref.id);
            const disabled = !isSelected && selectedReferees.length >= 3;

            return (
              <div
                key={ref.id}
                onClick={() => !disabled && handleRefereeToggle(ref)}
                className={`border rounded-lg px-4 py-3 cursor-pointer
                  ${isSelected
                    ? "border-[#00AEEF] bg-blue-50"
                    : disabled
                      ? "bg-gray-100 opacity-50"
                      : "hover:border-[#00AEEF]"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <p>{ref.name}</p>
                  <input type="checkbox" checked={isSelected} readOnly />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-4">
          <CommonSubmitBtn variant="secondary" onClick={handleCloseModal}>
            Cancel
          </CommonSubmitBtn>

          <CommonSubmitBtn variant="secondary" onClick={handleBlockCourt}>
            <FaShield className="mr-2" />
            Block Court
          </CommonSubmitBtn>

          <CommonSubmitBtn
            onClick={() => assignMutation.mutate()}
            disabled={selectedReferees.length === 0}
            loading={assignMutation.isPending}
          >
            Update ({selectedReferees?.length}/3)
          </CommonSubmitBtn>
        </div>
      </div>
    </Modal>
  );
};
export default ScheduleAddModal;