import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const AddMemberModal = ({ open, onClose, crewId, campId }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const listRef = useRef(null);

  // Fetch available referees (that are NOT yet in this crew)

  
  const {
    data,
    isLoading: loading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["available-referees-for-crew", crewId, campId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(
        `/v1/camp/${campId}/available-referees-for-crew`,
        { params: { page: pageParam } }
      );
      return res?.data?.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const current = Number(lastPage.pagination.current_page);
      const total = Number(lastPage.pagination.last_page);
      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!campId && !!crewId && open,
    staleTime: 60 * 1000,
  });

  const allReferees = data?.pages?.flatMap((p) => p?.referees || []) || [];

  const filteredReferees = allReferees.filter((ref) =>
    ref?.name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  // Infinite scroll setup (same as before) ...
  useEffect(() => {
    if (!listRef.current || !hasNextPage || isFetchingNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    listRef.current.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [hasNextPage, isFetchingNextPage, loading, fetchNextPage]);

  const toggleSelection = (referee) => {
    setSelectedMembers((prev) => {
      if (prev.some((r) => r.id === referee.id)) {
        return prev.filter((r) => r.id !== referee.id);
      }
      if (prev.length >= 6) {
        toast.warning("Maximum 6 members can be added at once");
        return prev;
      }
      return [...prev, referee];
    });
  };

  // ── ADD MEMBERS mutation ──
  const addMembersMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        referee_ids: selectedMembers.map((m) => m.id),
      };
      const res = await axiosInstance.post(
        `/v1/crew/${crewId}/add-members`,
        payload
      );
      return res?.data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Members added successfully!");
      queryClient.invalidateQueries(["crew", crewId]);
      // Optional: also invalidate available-referees list if needed
      queryClient.invalidateQueries(["available-referees-for-crew", crewId, campId]);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add members");
    },
  });

  const handleAddMembers = () => {
    if (selectedMembers.length === 0) {
      toast.error("Select at least one member to add");
      return;
    }
    addMembersMutation.mutate();
  };

  useEffect(() => {
    if (open) {
      setSelectedMembers([]);
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Modal
      title={<span className="text-xl font-semibold">Add Members to Crew</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div className="mt-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium text-gray-700">
            Select Referees to Add (Max 6 at a time)
          </p>
          <p className="text-sm font-semibold text-[#00AEEF]">
            Selected: {selectedMembers.length}/6
          </p>
        </div>

        <Input
          placeholder="Search by name..."
          allowClear
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div
          ref={listRef}
          className="max-h-[450px] overflow-y-auto space-y-3 pr-3 scrollbar-thin scrollbar-thumb-gray-400"
        >
          {loading && !data ? (
            <div className="text-center py-12">
              <Spin size="large" tip="Loading available referees..." />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load available referees
            </div>
          ) : filteredReferees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No matching referees" : "No available referees"}
            </div>
          ) : (
            <>
              {filteredReferees.map((ref) => {
                const isSelected = selectedMembers.some((r) => r.id === ref.id);
                const disabled = !isSelected && selectedMembers.length >= 6;

                return (
                  <div
                    key={ref.id}
                    onClick={() => !disabled && toggleSelection(ref)}
                    className={`
                      border rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer
                      ${isSelected ? "border-[#00AEEF] bg-blue-50 shadow-md" : ""}
                      ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : "hover:border-[#00AEEF] hover:shadow-md border-gray-200"}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar src={ref.avatar} size={48} className="border-2 border-gray-200" />
                      <div>
                        <p className="font-medium text-gray-800">{ref.name}</p>
                        <p className="text-sm text-gray-500">{ref.email}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-5 h-5 text-[#00AEEF] rounded pointer-events-none"
                    />
                  </div>
                );
              })}

              {isFetchingNextPage && (
                <div className="text-center py-8">
                  <Spin tip="Loading more..." />
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleAddMembers}
            loading={addMembersMutation.isPending}
            disabled={selectedMembers.length === 0 || addMembersMutation.isPending}
          >
            {addMembersMutation.isPending ? "Adding..." : "Add Selected Members"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;