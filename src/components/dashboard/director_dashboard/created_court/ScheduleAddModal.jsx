import { Modal } from "antd";
import refereeImage from "@/assets/dashboard/refereeImg.png";

const refereeListData = [
    {
        id: 1,
        refImage: refereeImage,
        name: "ref63"
    },
    {
        id: 2,
        refImage: refereeImage,
        name: "ref63"
    },
    {
        id: 3,
        refImage: refereeImage,
        name: "ref63"
    },
    {
        id: 4,
        refImage: refereeImage,
        name: "ref63"
    }
];

const ScheduleAddModal = ({ isModalOpen, handleCloseModal, selectedCourt }) => {
    return (
        <div className="w-ful">
            <Modal
                title={`Add Schedule - ${selectedCourt?.court}`}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                // width={500}
                className="min-w-[800px]"
                style={{ top: 20 }}
                centered
            >
                <div className="space-y-4 mt-6">
                    <p className="text-[#333] text-lg font-medium">Referees</p>
                    {/* referee select list and checkbox*/}
                    <div className="w-full grid grid-cols-1 gap-4">
                        {
                            refereeListData.map((referee) => (
                                <div
                                    key={referee.id}
                                    className="w-full flex items-center justify-between border border-[#E8E8E8] rounded-lg py-1 px-3"
                                >
                                    {/* referee image and name */}
                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="size-8 shrink-0 rounded-full" >
                                            <img src={referee?.refImage} alt="" className="w-full h-full rounded-full" />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[#333] text-base font-normal">{referee?.name}</p>
                                        </div>
                                    </div>

                                    {/* checkbox */}
                                    <div className="w-full flex items-center justify-end">
                                        <input type="checkbox" className="cursor-pointer size-4 accent-primary checked:text-white" />
                                    </div>
                                </div>

                            ))
                        }
                    </div>

                </div>
            </Modal>
        </div>
    );
};
export default ScheduleAddModal;