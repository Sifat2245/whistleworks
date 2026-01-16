import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreateCrewModal = ({ openModal, handleCloseModal, campId }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [crewName, setCrewName] = useState("");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const refereesListRef = useRef(null);

  // Infinite query for paginated referees
  const {
    data,
    isLoading: loadingReferees,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["available-referees-for-crew", campId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(
        `/v1/camp/${campId}/available-referees-for-crew`,
        {
          params: { page: pageParam },
        }
      );
      return res?.data?.data;
    },
    getNextPageParam: (lastPage) => {
      // Critical safety check - prevent crash when lastPage is undefined
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }

      const current = Number(lastPage.pagination.current_page);
      const total = Number(lastPage.pagination.last_page);

      // Handle invalid/missing numbers
      if (isNaN(current) || isNaN(total)) {
        return undefined;
      }

      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!campId && openModal,
    staleTime: 1 * 60 * 1000, // 1 minutes
  });

  // Flatten all loaded pages into one array
  const allReferees = data?.pages?.flatMap((page) => page?.referees || []) || [];

  // Client-side filtering
  const filteredReferees = allReferees.filter((ref) =>
    ref?.name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  // Infinite scroll observer
  useEffect(() => {
    if (
      !refereesListRef.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      loadingReferees
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // trigger earlier
    );

    const sentinel = document.createElement("div");
    sentinel.id = "scroll-sentinel";
    refereesListRef.current.appendChild(sentinel);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
    };
  }, [hasNextPage, isFetchingNextPage, loadingReferees, fetchNextPage]);

  // Toggle referee selection (max 6)
  const handleRefereeToggle = (referee) => {
    setSelectedReferees((prev) => {
      const exists = prev.find((r) => r.id === referee.id);
      if (exists) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= 6) {
        toast.warning("Maximum 6 referees can be selected per crew");
        return prev;
      }
      return [...prev, referee];
    });
  };

  // Create crew mutation
  const createCrewMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(
        `/v1/camp/${campId}/crew/create`,
        payload
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Crew created successfully!");
      queryClient.invalidateQueries({ queryKey: ["crew-groups", campId] });
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create crew");
    },
  });

  const handleCreateCrew = () => {
    if (!crewName.trim()) {
      toast.error("Crew name is required");
      return;
    }
    if (selectedReferees.length === 0) {
      toast.error("Please select at least one referee");
      return;
    }

    const payload = {
      name: crewName.trim(),
      referee_ids: selectedReferees.map((r) => r.id),
    };

    createCrewMutation.mutate(payload);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (openModal) {
      setCrewName("");
      setSelectedReferees([]);
      setSearchTerm("");
    }
  }, [openModal]);

  return (
    <Modal
      title={<span className="text-xl font-semibold">Create New Crew</span>}
      open={openModal}
      onCancel={handleCloseModal}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div className="mt-4 space-y-6">
        {/* Crew Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crew Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Elite Officials Crew"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            size="large"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {crewName.length}/50 characters
          </p>
        </div>

        {/* Referees Selection */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-gray-700">Select Referees (Max 6)</p>
            <p className="text-sm font-semibold text-[#00AEEF]">
              Selected: {selectedReferees.length}/6
            </p>
          </div>

          <Input
            placeholder="Search referees by name..."
            allowClear
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div
            ref={refereesListRef}
            className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin scrollbar-thumb-gray-400"
          >
            {loadingReferees && !data ? (
              <div className="text-center py-12">
                <Spin size="large" tip="Loading referees..." />
              </div>
            ) : isError ? (
              <div className="text-center py-12 text-red-500">
                Failed to load referees. Please try again.
              </div>
            ) : filteredReferees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm
                  ? "No referees match your search"
                  : "No available referees found"}
              </div>
            ) : (
              <>
                {filteredReferees.map((ref) => {
                  const isSelected = selectedReferees.some(
                    (r) => r.id === ref.id
                  );
                  const isDisabled =
                    !isSelected && selectedReferees.length >= 6;

                    console.log(ref, 'referee');

                  return (
                    <div
                      key={ref.id}
                      onClick={() => !isDisabled && handleRefereeToggle(ref)}
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer
                        ${
                          isSelected
                            ? "border-[#00AEEF] bg-blue-50 shadow-md"
                            : isDisabled
                            ? "bg-gray-50 opacity-60 cursor-not-allowed"
                            : "hover:border-[#00AEEF] hover:shadow-md border-gray-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={ref.avatar}
                          size={48}
                          className="border-2 border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {ref.name}
                          </p>
                          <p className="text-sm text-gray-500">{ref.email}</p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-5 h-5 text-[#00AEEF] rounded focus:ring-[#00AEEF] pointer-events-none"
                      />
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="text-center py-8">
                    <Spin tip="Loading more referees..." />
                  </div>
                )}

                {!hasNextPage && allReferees.length > 0 && !loadingReferees && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    All available referees loaded
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button size="large" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleCreateCrew}
            loading={createCrewMutation.isPending}
            disabled={
              !crewName.trim() ||
              selectedReferees.length === 0 ||
              createCrewMutation.isPending
            }
          >
            {createCrewMutation.isPending ? "Creating..." : "Create Crew"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCrewModal;