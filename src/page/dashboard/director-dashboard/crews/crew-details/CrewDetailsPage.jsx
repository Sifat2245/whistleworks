import { useParams, useNavigate } from "react-router-dom";
import {
  useCrewDetails,
  useDeleteCrew,
} from "@/hooks/api/director-hooks/useCrews";
import MemberCard from "@/page/dashboard/director-dashboard/crews/crew-details/components/MemberCard";
import CrewDetailsSkeleton from "@/page/dashboard/director-dashboard/crews/crew-details/components/CrewDetailsSkeleton";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Swal from "sweetalert2";
import AddMemberModal from "@/page/dashboard/director-dashboard/crews/crew-details/components/AddMenberModal";
import EditCrewModal from "@/page/dashboard/director-dashboard/crews/components/EditCrewModal";
import { useState } from "react";
import {
  LuUserPlus,
  LuTrash2,
  LuPencil,
  LuUsers,
  LuTrophy,
  LuShieldCheck,
  LuClock,
  LuMapPin,
  LuInbox,
  LuTriangleAlert,
  LuRefreshCw,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

const CrewDetailsPage = () => {
  const { crewId } = useParams();
  const navigate = useNavigate();

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    crewDetails: crewData,
    isLoading,
    isError,
  } = useCrewDetails(crewId);

  const deleteMutation = useDeleteCrew();

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. All members will be removed from this crew.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete Crew",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const campId = crewData?.camp?.id;
        return deleteMutation
          .mutateAsync({ crewId, campId })
          .then(() => {
            navigate(-1);
          })
          .catch(() => {
            Swal.showValidationMessage("Failed to delete crew");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleOpenAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <CrewDetailsSkeleton />
      </div>
    );
  }

  if (isError || !crewData) {
    return (
      <div className="w-full p-4 md:p-6 lg:p-8">
        <BackBtn />
        <div className="mt-6 mx-auto max-w-md bg-red-50 border border-red-200 rounded-[10px] p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            Failed to Load Crew Details
          </h2>
          <p className="text-red-600 mb-4">Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <LuRefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { name, status, member_count, members, assigned_games, camp, description } =
    crewData;

  const statusChip =
    status === "active"
      ? "bg-green-50 text-green-700 border border-green-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <BackBtn />

      {/* Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#333] truncate">
            {name || "Unnamed Crew"}
          </h1>
          {description && (
            <p className="text-sm text-[#666] mt-1.5 line-clamp-2 max-w-2xl">
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold",
                statusChip,
              )}
            >
              {status === "active" ? (
                <LuShieldCheck className="w-4 h-4" />
              ) : (
                <LuClock className="w-4 h-4" />
              )}
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-[#666]">
              <LuMapPin className="text-primary" />
              Camp:{" "}
              <span className="font-medium text-[#333]">
                {camp?.name || "—"}
              </span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition cursor-pointer"
          >
            <LuPencil className="w-4 h-4" /> Edit Crew
          </button>

          <CommonSubmitBtn
            variant="primary"
            className="px-5"
            type="button"
            onClick={handleOpenAddMemberModal}
          >
            <span className="inline-flex items-center gap-2">
              <LuUserPlus className="text-base" /> Add Member
            </span>
          </CommonSubmitBtn>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <LuTrash2 className="w-4 h-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete Crew"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl">
        <div className="bg-white border border-border rounded-[10px] px-4 py-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <span className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
            <LuUsers />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#333]">{member_count}</p>
            <p className="text-xs text-[#666] mt-0.5">Total Members</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[10px] px-4 py-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <span className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
            <LuTrophy />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#333]">{assigned_games}</p>
            <p className="text-xs text-[#666] mt-0.5">Assigned Games</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[10px] px-4 py-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
          <span className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
            <LuShieldCheck />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#333] capitalize">{status}</p>
            <p className="text-xs text-[#666] mt-0.5">Crew Status</p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3.5 mb-6">
          <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
            <LuUsers />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[#333]">Crew Members</h2>
            <p className="text-sm text-[#666]">
              {member_count} member{member_count !== 1 ? "s" : ""} in this crew
            </p>
          </div>
        </div>

        {members?.length === 0 ? (
          <div className="bg-white border border-border rounded-[10px] py-16 text-center">
            <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#333]">
              No Members Yet
            </h3>
            <p className="text-sm text-[#666] mt-1">
              Add referees to this crew to get started.
            </p>
            <button
              onClick={handleOpenAddMemberModal}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-primary text-white font-medium hover:bg-primary/90 transition cursor-pointer"
            >
              <LuUserPlus className="text-lg" /> Add Members
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} crewId={crewId} />
            ))}
          </div>
        )}
      </div>

      {isAddMemberModalOpen && (
        <AddMemberModal
          open={isAddMemberModalOpen}
          onClose={handleCloseAddMemberModal}
          crewId={crewId}
          campId={camp?.id}
        />
      )}

      {isEditModalOpen && (
        <EditCrewModal
          openModal={isEditModalOpen}
          handleCloseModal={() => setIsEditModalOpen(false)}
          crewData={crewData}
          campId={camp?.id}
        />
      )}
    </div>
  );
};

export default CrewDetailsPage;
