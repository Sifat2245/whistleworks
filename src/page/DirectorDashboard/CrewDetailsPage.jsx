import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import MemberCard from "@/components/dashboard/director_dashboard/CrewDetails/MemberCard";
import BackBtn from "@/components/common/BackBtn";
import { Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import toast from "react-hot-toast";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Swal from "sweetalert2";
import AddMemberModal from "@/components/dashboard/director_dashboard/Crew/AddMenberModal";
import { useState } from "react";

const CrewDetailsPage = () => {
  const { crewId } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const {
    data: crewData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["crew", crewId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/crew/${crewId}`);
      return response?.data?.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/v1/crew/delete/${crewId}`);
    },
    onSuccess: () => {
      toast.success("Crew deleted successfully");
      queryClient.invalidateQueries(["crew-groups"]); // refresh crew list
      navigate(-1); // go back
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete crew");
    },
  });

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
        return deleteMutation.mutateAsync().catch(() => {
          Swal.showValidationMessage("Failed to delete crew");
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Success handled in onSuccess of mutation
      }
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
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !crewData) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Failed to load crew details.</p>
      </div>
    );
  }

  const { name, status, member_count, members, assigned_games, camp } =
    crewData;

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <BackBtn />

      {/* Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {name || "Unnamed Crew"}
          </h1>
          {/* <p className="text-gray-600 mt-2">
            {description || "No description provided."}
          </p> */}
          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Camp:{" "}
              <span className="font-medium text-gray-700">{camp?.name}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <CommonSubmitBtn
            variant="primary"
            className="px-5 flex items-center"
            onClick={handleOpenAddMemberModal}
          >
            <BiEdit className="w-5 h-5 mr-2" />
            Add Member
          </CommonSubmitBtn>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaDeleteLeft className="w-5 h-5" />
            {deleteMutation.isPending ? "Deleting..." : "Delete Crew"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-black/15">
          <p className="text-gray-500 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {member_count}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-black/15">
          <p className="text-gray-500 text-sm">Assigned Games</p>
          <p className="text-3xl font-bold text-primary mt-2">
            {assigned_games}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-black/15">
          <p className="text-gray-500 text-sm">Crew Status</p>
          <p className="text-2xl font-bold text-green-600 mt-2 capitalize">
            {status}
          </p>
        </div>
      </div>

      {/* Members Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crew Members</h2>

        {members?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500 text-lg">
              No members in this crew yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default CrewDetailsPage;
