import BackBtn from "@/components/common/BackBtn";
import { crewGroups } from "@/fakeDB/active_crew";
import { Modal } from "antd";
import { useState } from "react";

const ActiveCrews = () => {
    // eslint-disable-next-line no-unused-vars
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500';
            case 'On Break':
                return 'bg-yellow-500';
            case 'Inactive':
                return 'bg-gray-400';
            default:
                return 'bg-blue-500';
        }
    };
    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    // Note: main ui component
    return (
        <div className="w-full min-h-screen p-4 md:p-6">
            <div className="">
                <div className="mb-8">
                    <BackBtn />

                    {/* active crews statistics */}
                    <div className="w-full mt-4">
                        <div className="w-full flex items-center justify-between">
                            <div className="w-full flex flex-col">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Crew Groups</h1>
                                <p className="text-gray-600 mt-2">Manage and view all active crew groups</p>
                            </div>

                            {/* create a referee crew button */}

                            <button onClick={handleOpenModal} className="cursor-pointer px-4 py-3 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold whitespace-nowrap transition-all duration-300">
                                Create a Referee Crew
                            </button>


                        </div>

                        {/* Stats Overview */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px]">
                                <p className="text-gray-500 text-sm">Total Groups</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{crewGroups?.length}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px]">
                                <p className="text-gray-500 text-sm">Total Crew Members</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {crewGroups?.reduce((total, group) => total + group.crewMembers.length, 0)}
                                </p>
                            </div>
                            {/* <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px]">
                                <p className="text-gray-500 text-sm">Active Crew</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {crewGroups?.flatMap(g => g.crewMembers).filter(crew => crew.status === 'Active').length}
                                </p>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Crew members */}
                <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-700 mb-8">Active Crew Groups</h2>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {crewGroups?.map((group) => (
                            <div
                                key={group.groupId}
                                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
                            >
                                {/* Group Number Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                                        {group?.groupNumber}
                                    </div>
                                </div>

                                {/* Group Header */}
                                {/* <div className="p-5 border-b border-gray-100">
                                    <div className="pr-12">
                                        <h3 className="text-lg font-bold text-gray-800 truncate">
                                            {group?.match}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{group?.location}</span>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Crew Members List */}
                                <div className="p-5">
                                    {group.crewMembers.map((crew, index) => (
                                        <div
                                            key={crew.id}
                                            className={`flex items-center gap-3 py-3 ${index < group.crewMembers.length - 1 ? 'border-b border-gray-100' : ''
                                                }`}
                                        >
                                            {/* Crew Avatar */}
                                            <div className="relative">
                                                <img
                                                    src={crew.image}
                                                    alt={crew.refeName}
                                                    className="w-12 h-12 rounded-full border-2 border-white shadow"
                                                />
                                                {/* <span
                                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(crew.status)}`}
                                                /> */}
                                            </div>

                                            {/* Crew Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-800 truncate">
                                                    {crew?.refeName}
                                                </h4>
                                                {/* <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">{crew.role}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(crew.status).replace('bg-', 'bg-')} text-white`}>
                                                        {crew.status}
                                                    </span>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* View Button */}
                                {/* <div className="p-5 pt-0">
                                    <button className="w-full py-3 bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-md">
                                        <BsEye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {
                openModal && (
                    <Modal
                        open={openModal}
                        onCancel={handleCloseModal}
                        footer={null}
                        centered
                    >
                        Crew add modal
                    </Modal>
                )
            }
        </div>
    );
};
export default ActiveCrews;