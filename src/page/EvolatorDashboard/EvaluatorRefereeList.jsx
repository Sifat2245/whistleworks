"use client";

import { Avatar, Pagination, Card } from "antd";
import { useState } from "react";
import useRegisteredReferees from "@/hooks/get-registered-referees";

const EvaluatorRefereeList = ({ camp_id }) => {
    const [page, setPage] = useState(1);

    const {
        getRegisterReferess = [],
        pagination = {},
        isLoading,
    } = useRegisteredReferees(camp_id, page);

    // Note: main ui component
    return (
        <div className="w-full flex flex-col gap-6">
            <h1 className="text-2xl font-semibold text-center">
                Registered Referees list ({getRegisterReferess.length})
            </h1>

            {/* Grid */}
            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : getRegisterReferess.length === 0 ? (
                <p className="text-center text-gray-500">
                    No referees found
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {getRegisterReferess.map((ref) => (
                        <Card
                            key={ref.id}
                            hoverable
                            className="
                group
                relative
                overflow-hidden
                rounded-xl
                border border-black/10
                shadow-sm
                transition-all
                duration-300
              "
                        >
                            {/* CENTER GRADIENT OVERLAY */}
                            <div
                                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]
                "
                            />

                            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                <Avatar size={80} src={ref?.avatar} />

                                <div>
                                    <h3 className="text-lg font-medium text-black">
                                        {ref?.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium text-[#444]">
                                            Email:
                                        </span>{" "}
                                        {ref?.email}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium text-[#444]">
                                            Phone:
                                        </span>{" "}
                                        {ref?.phone}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination?.total > pagination?.per_page && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        current={pagination?.current_page}
                        total={pagination?.total}
                        pageSize={pagination?.per_page}
                        onChange={(p) => setPage(p)}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};
export default EvaluatorRefereeList;