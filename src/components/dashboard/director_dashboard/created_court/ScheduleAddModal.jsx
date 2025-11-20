import { useState, useEffect } from "react";
import { Modal } from "antd";
import refereeImage from "@/assets/dashboard/refereeImg.png";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { FaShield } from "react-icons/fa6";

const refereeListData = [
    {
        id: 1,
        refImage: refereeImage,
        name: "ref63"
    },
    {
        id: 2,
        refImage: refereeImage,
        name: "ref64"
    },
    {
        id: 3,
        refImage: refereeImage,
        name: "ref65"
    },
    {
        id: 4,
        refImage: refereeImage,
        name: "ref66"
    }
];

const ScheduleAddModal = ({
    isModalOpen,
    handleCloseModal,
    selectedCourt,
    selectedTimeSlot,
    handleBlockCourt,
    handleRefereeUpdate,
    existingReferees
}) => {
    const [selectedReferees, setSelectedReferees] = useState([]);

    useEffect(() => {
        // Initialize with existing referees when modal opens
        if (isModalOpen) {
            setSelectedReferees(existingReferees);
        }
    }, [isModalOpen, existingReferees]);

    const handleRefereeToggle = (referee) => {
        setSelectedReferees(prev => {
            const isSelected = prev.find(r => r.id === referee.id);

            if (isSelected) {
                // Remove referee if already selected
                return prev.filter(r => r.id !== referee.id);
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
                        {refereeListData.map((referee) => {
                            const isSelected = selectedReferees.find(r => r.id === referee.id);
                            const isDisabled = !isSelected && selectedReferees.length >= 3;

                            return (
                                <div
                                    key={referee.id}
                                    className={`w-full flex items-center justify-between border rounded-lg py-1 px-3 transition-all
                                        ${isSelected
                                            ? "border-[#00AEEF] bg-blue-50"
                                            : isDisabled
                                                ? "border-gray-200 bg-gray-100 opacity-50"
                                                : "border-border hover:border-[#00AEEF]"
                                        }`}
                                >
                                    {/* referee image and name */}
                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="size-8 shrink-0 rounded-full">
                                            <img
                                                src={referee?.refImage}
                                                alt={referee.name}
                                                className="w-full h-full rounded-full"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[#333] text-base font-normal">{referee?.name}</p>
                                        </div>
                                    </div>

                                    {/* checkbox */}
                                    <div className="w-full flex items-center justify-end">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleRefereeToggle(referee)}
                                            disabled={isDisabled && !isSelected}
                                            className="cursor-pointer size-4 accent-primary checked:text-white"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* cancel, no game and update buttons */}
                    <div className="w-full flex items-center justify-between pt-4">
                        <CommonSubmitBtn variant="secondary" onClick={handleCancel} >
                            Cancel
                        </CommonSubmitBtn>

                        <CommonSubmitBtn onClick={handleBlockCourt} variant="secondary" >
                            <FaShield className="text-lg mr-1.5" />
                            Block this court
                        </CommonSubmitBtn>

                        <CommonSubmitBtn onClick={handleUpdate} disabled={selectedReferees.length === 0} >
                            Update ({selectedReferees.length}/3)
                        </CommonSubmitBtn>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default ScheduleAddModal;