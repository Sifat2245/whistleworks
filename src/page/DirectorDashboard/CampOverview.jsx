/* eslint-disable no-unused-vars */
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Select } from "antd";
import { toast } from "react-hot-toast";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { FaEdit, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdSportsSoccer, MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";

const CampOverview = () => {
  const campData = useLoaderData();
  const data = campData?.data?.data;
  const axiosInstance = useAxiosSecure();
  const { userData } = useAuth();
  const directorEmail = data?.director?.email;
  const userEmail = userData?.email;

  // console.log(campData, 'data');

  const navigate = useNavigate();

  const [status, setStatus] = useState(data?.status);

  const handleStatusChange = async (value) => {
    setStatus(value);

    try {
      await axiosInstance.post(`/v1/camp/status/${data.id}`, {
        status: value,
      });
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

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

    try {
      await axiosInstance.delete(`/v1/camp/delete/${data.id}`);

      Swal.fire({
        title: "Deleted!",
        text: "Camp has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/director-dashboard");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete camp.",
        icon: "error",
      });
    }
  };

  return (
    <div className="space-y-4">
      <BackBtn />

      {/* ================= Overview ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-medium">Overview</h3>

          {directorEmail === userEmail && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* ↑ added flex-wrap + responsive gap */}

              <Link to={`/director-dashboard/edit-camp/${data?.id}`}>
                <CommonSubmitBtn
                  variant="primary"
                  className="flex items-center gap-1 py-2 px-4" // ← ensure decent padding
                >
                  <FaEdit />
                  Edit
                </CommonSubmitBtn>
              </Link>

              <Select
                value={status}
                size="large"
                onChange={handleStatusChange}
                className="w-36 min-w-[120px] border border-black/15 rounded-lg" // ← min-w prevents too small
                // Optional: dropdownMatchSelectWidth={false} if dropdown overflows badly
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>

              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm cursor-pointer whitespace-nowrap"
                // ↑ whitespace-nowrap prevents text breaking awkwardly
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <img
            src={data?.camp_logo}
            alt={data?.camp_name}
            className="w-9 h-9 rounded-full"
          />
          <p className="text-xl font-medium">{data?.camp_name}</p>
        </div>

        <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary" />
          {data?.location}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
          <MdSportsSoccer className="text-primary" />
          {data?.sport?.sports_name}
        </p>
      </div>

      {/* ================= Description ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-3">Camp Description</h3>
        <div
          className="text-gray-600 prose prose-sm sm:prose lg:prose-base max-w-none"
          dangerouslySetInnerHTML={{
            __html: data?.camp_details || "<p>No description available.</p>",
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
          {data?.start_date} — {data?.end_date}
        </p>

        <ul className="mt-2 text-sm text-gray-600">
          {data?.date_range?.map((d, i) => (
            <li key={i}>• {d.day}</li>
          ))}
        </ul>
      </div>

      {/* ================= Other Info ================= */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-3">Other Info</h3>

        <p className="flex items-center gap-2 mb-1">
          <MdOutlineAttachMoney className="text-primary" />
          Price: ${data?.price}
        </p>

        <p className="flex items-center gap-2 mb-1">
          <BsCheckCircle className="text-primary" />
          Status: {status}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Created at: {data?.created_at}
        </p>
      </div>
    </div>
  );
};

export default CampOverview;
