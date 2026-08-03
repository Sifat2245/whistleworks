import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Avatar, Spin } from "antd";
import toast from "react-hot-toast";
import {
  useAvailableRefereesForCrew,
  useAddMembersToCrew,
} from "@/hooks/api/director-hooks/useCrews";
import { cn } from "@/lib/utils";
import {
  LuCheck,
  LuInbox,
  LuTriangleAlert,
  LuSearch,
} from "react-icons/lu";

const AddMemberModal = ({ open, onClose, crewId, campId }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const listRef = useRef(null);

  const addMembersMutation = useAddMembersToCrew(crewId, campId);

  const {
    data,
    isLoading: loading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAvailableRefereesForCrew(campId, crewId, open);

  const allReferees = data?.pages?.flatMap((p) => p?.referees || []) || [];

  const filteredReferees = allReferees.filter((ref) =>
    ref?.name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  // Infinite scroll setup
  useEffect(() => {
    if (!listRef.current || !hasNextPage || isFetchingNextPage || loading)
      return;

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

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Select at least one member to add");
      return;
    }

    const payload = {
      referee_ids: selectedMembers.map((m) => m.id),
    };

    try {
      await addMembersMutation.mutateAsync(payload);
      onClose();
    } catch {
      // Error toast handled in hook
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedMembers([]);
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Modal
      title={
        <span className="text-lg font-semibold text-[#333]">
          Add Members to Crew
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div className="mt-4 space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-medium text-[#333]">
            Select Referees to Add{" "}
            <span className="text-red-500">(Max 6 at a time)</span>
          </p>
          <p className="text-sm font-semibold text-primary">
            Selected: {selectedMembers.length}/6
          </p>
        </div>

        <Input
          placeholder="Search referees by name..."
          allowClear
          size="large"
          prefix={<LuSearch className="text-[#999]" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-[10px] border-border"
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
            <div className="text-center py-12">
              <LuTriangleAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-500">Failed to load available referees</p>
            </div>
          ) : filteredReferees.length === 0 ? (
            <div className="text-center py-12">
              <LuInbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "No matching referees" : "No available referees"}
              </p>
            </div>
          ) : (
            <>
              {filteredReferees.map((ref) => {
                const isSelected = selectedMembers.some(
                  (r) => r.id === ref.id
                );
                const disabled = !isSelected && selectedMembers.length >= 6;

                return (
                  <div
                    key={ref.id}
                    onClick={() => !disabled && toggleSelection(ref)}
                    className={cn(
                      "border rounded-[10px] p-4 flex items-center justify-between transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                        : disabled
                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                        : "border-border bg-white hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar
                        src={ref.avatar}
                        size={48}
                        className="border-2 border-primary/20 bg-primary/10 text-primary shrink-0"
                      >
                        {ref.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-[#333] truncate">
                          {ref.name}{" "}
                          {ref.jersey_number ? `#${ref.jersey_number}` : ""}
                        </p>
                        <p className="text-sm text-[#666] truncate">
                          {ref.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-[#BBB] bg-white"
                      )}
                    >
                      {isSelected && (
                        <LuCheck className="w-3.5 h-3.5 text-white" />
                      )}
                    </span>
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
            disabled={
              selectedMembers.length === 0 || addMembersMutation.isPending
            }
            style={{ backgroundColor: "#00AEEF", borderColor: "#00AEEF" }}
          >
            {addMembersMutation.isPending ? "Adding..." : "Add Selected Members"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
