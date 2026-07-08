/* eslint-disable no-unused-vars */
import { Link, useNavigate, useParams } from "react-router-dom";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import ScreenLoading from "@/components/common/ScreenLoading";
import { FaEdit, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdSportsSoccer, MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetCampDetails,
  useDeleteCamp,
} from "@/hooks/api/director-hooks/useCamps";

const CampOverview = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const { data: campData, isLoading } = useGetCampDetails(id);
  const deleteCampMutation = useDeleteCamp({
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Camp has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/director-dashboard");
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete camp.",
        icon: "error",
      });
    },
  });

  const status = campData?.status;
  const directorEmail = campData?.director?.email;
  const userEmail = userData?.email;

  /* ================= Delete Camp ================= */
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This camp will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    deleteCampMutation.mutate(id);
  };

  if (isLoading) return <ScreenLoading />;

  return (
    <div className="space-y-4 pb-12">
      <BackBtn />

      {/* ================= Overview ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-medium">Overview</h3>

          {directorEmail === userEmail && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link to={`/director-dashboard/edit-camp/${campData?.id}`}>
                <CommonSubmitBtn
                  variant="primary"
                  className="flex items-center gap-1 py-1.5! px-4"
                >
                  <FaEdit />
                  Edit
                </CommonSubmitBtn>
              </Link>

              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm cursor-pointer whitespace-nowrap"
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <img
            src={campData?.camp_logo}
            alt={campData?.camp_name}
            className="w-9 h-9 rounded-full"
          />
          <p className="text-xl font-medium">{campData?.camp_name}</p>
        </div>

        <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary" />
          {campData?.location}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
          <MdSportsSoccer className="text-primary" />
          {campData?.sport?.sports_name}
        </p>
      </div>

      {/* ================= Description ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-3">Camp Description</h3>
        <div
          className="text-gray-600 prose prose-sm sm:prose lg:prose-base max-w-none"
          dangerouslySetInnerHTML={{
            __html: campData?.camp_details || "<p>No description available.</p>",
          }}
        />
      </div>

      {/* ================= Dates ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
          <AiOutlineCalendar />
          Dates
        </h3>

        <p className="mb-2">
          {campData?.start_date} — {campData?.end_date}
        </p>

        <ul className="mt-2 text-sm text-gray-600">
          {campData?.date_range?.map((d, i) => (
            <li key={i}>• {d.day}</li>
          ))}
        </ul>
      </div>

      {/* ================= Other Info ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-3">Other Info</h3>

        <p className="flex items-center gap-2 mb-1">
          <MdOutlineAttachMoney className="text-primary" />
          Price: ${campData?.price}
        </p>

        <p className="flex items-center gap-2 mb-1">
          <BsCheckCircle className="text-primary" />
          Status: {status}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Created at: {campData?.created_at}
        </p>
      </div>
    </div>
  );
};

export default CampOverview;
