import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import ScreenLoading from "@/components/common/ScreenLoading";
import SectionCard from "@/components/common/SectionCard";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import dayjs from "dayjs";
import useCountdown from "@/hooks/useCountdown";
import {
  formatDate,
  formatPrice,
  getDurationDays,
} from "@/utils/campFormat";
import {
  useGetCampDetails,
  useDeleteCamp,
} from "@/hooks/api/director-hooks/useCamps";
import {
  LuCalendarDays,
  LuMapPin,
  LuDollarSign,
  LuClock,
  LuTrophy,
  LuFileText,
  LuTimer,
  LuCircleCheck,
  LuInfo,
  LuSettings2,
} from "react-icons/lu";
import { MdOutlineSportsTennis } from "react-icons/md";
import ManageCampModal from "./components/ManageCampModal";
import { dummyDirectors } from "./components/dummyDirectors";

const STATUS_META = {
  upcoming: {
    label: "Upcoming",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  active: {
    label: "Active",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  open: {
    label: "Open",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

const getStatusMeta = (status) =>
  STATUS_META[String(status || "").toLowerCase()] || {
    label: status || "—",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  };

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
  const statusMeta = getStatusMeta(status);
  const directorEmail = campData?.director?.email;
  const userEmail = userData?.email;

  const startDate = campData?.start_date;
  const endDate = campData?.end_date;
  const durationDays = getDurationDays(startDate, endDate);
  const price = formatPrice(campData?.price);

  // Live countdown until the camp starts (only for upcoming camps)
  const isUpcoming =
    status?.toLowerCase() === "upcoming" ||
    (startDate && dayjs(startDate).valueOf() > Date.now());
  const countdown = useCountdown(isUpcoming ? startDate : null);

  /* ================= Manage Camp (assistant directors) ================= */
  const [manageCampOpen, setManageCampOpen] = useState(false);
  // Demo seed — will come from the real API later
  const [assistants, setAssistants] = useState(() => [
    {
      ...dummyDirectors[0],
      permissions: ["build_schedule", "assign_referee"],
    },
  ]);

  const handleAssignAssistant = (director, permissionKeys) => {
    setAssistants((prev) => [
      ...prev,
      { ...director, permissions: permissionKeys },
    ]);
  };

  const handleRemoveAssistant = async (assistantId) => {
    const result = await Swal.fire({
      title: "Remove assistant?",
      text: "This director will lose their access to this camp.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    setAssistants((prev) =>
      prev.filter((assistant) => assistant.id !== assistantId)
    );
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
    deleteCampMutation.mutate(id);
  };

  if (isLoading) return <ScreenLoading />;

  const stats = [
    {
      label: "Camp Dates",
      value: `${formatDate(startDate)} – ${formatDate(endDate)}`,
      icon: <LuCalendarDays />,
      tint: "bg-primary/10 text-primary",
    },
    {
      label: "Duration",
      value: durationDays ? `${durationDays} ${durationDays === 1 ? "day" : "days"}` : "—",
      icon: <LuClock />,
      tint: "bg-violet-50 text-violet-600",
    },
    {
      label: "Sport",
      value: campData?.sport?.sports_name || "—",
      icon: <MdOutlineSportsTennis />,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Camp Fee",
      value: price,
      icon: <LuDollarSign />,
      tint: "bg-emerald-50 text-emerald-600",
    },
  ];

  const dateRange = campData?.date_range || [];

  return (
    <div className="space-y-4 pb-12">
      <BackBtn />

      {/* ── Overview header card ─────────────────────────────── */}
      <div className="bg-white border border-border rounded-[10px] overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-border">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={campData?.camp_logo}
                alt={campData?.camp_name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/15 shrink-0 bg-gray-50"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#333] leading-tight">
                  {campData?.camp_name}
                </h2>
                <p className="text-sm text-[#666] mt-1 flex items-center gap-1.5 flex-wrap">
                  <MdOutlineSportsTennis className="text-primary shrink-0" />
                  <span className="capitalize">
                    {campData?.sport?.sports_name || "—"}
                  </span>
                  <span className="text-[#ccc]">•</span>
                  <LuMapPin className="text-primary shrink-0" />
                  <span className="capitalize">{campData?.location}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusMeta.className}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {statusMeta.label}
              </span>

              {directorEmail === userEmail && (
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <button
                    onClick={() => setManageCampOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-border text-[#333] hover:border-primary hover:text-primary rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors sm:px-4"
                  >
                    <LuSettings2 />
                    Manage Camp
                  </button>

                  <Link to={`/director-dashboard/edit-camp/${campData?.id}`}>
                    <CommonSubmitBtn
                      variant="primary"
                      className="flex items-center justify-center gap-1.5 py-2! px-3 sm:px-4"
                    >
                      <FaEdit />
                      Edit
                    </CommonSubmitBtn>
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors sm:px-4"
                  >
                    <FaTrashAlt />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* At-a-glance stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${stat.tint}`}
                >
                  {stat.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#333] leading-snug break-words">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#666]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live countdown — time left until the camp starts */}
          {countdown && (
            <div className="mt-4 bg-primary/[0.04] border border-primary/15 rounded-[10px] px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                  <LuTimer className="text-xl" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#333] leading-tight">
                    Camp starts in
                  </p>
                  <p className="text-xs text-[#666]">{formatDate(startDate)}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-4 gap-2">
                {[
                  { v: countdown.days, l: "Days" },
                  { v: countdown.hours, l: "Hours" },
                  { v: countdown.minutes, l: "Min" },
                  { v: countdown.seconds, l: "Sec" },
                ].map(({ v, l }) => (
                  <div
                    key={l}
                    className="bg-white border border-primary/15 rounded-lg py-2 text-center"
                  >
                    <p className="text-lg font-bold text-primary tabular-nums leading-tight">
                      {String(v).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#666] font-semibold mt-0.5">
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Camp Description ─────────────────────────────────── */}
      <SectionCard
        icon={<LuFileText />}
        title="Camp Description"
        description="Everything you need to know about this camp"
      >
        <div className="p-5 sm:p-7">
          <div
            className="camp-rich-content"
            dangerouslySetInnerHTML={{
              __html: campData?.camp_details || "<p>No description available.</p>",
            }}
          />
        </div>
      </SectionCard>

      {/* ── Camp Dates ───────────────────────────────────────── */}
      <SectionCard
        icon={<LuCalendarDays />}
        title="Camp Dates"
        description="The full schedule of this camp"
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <LuCalendarDays />
            </span>
            <div>
              <p className="text-xs text-[#666] mb-0.5">Duration</p>
              <p className="text-[15px] text-[#333]">
                {formatDate(startDate)} – {formatDate(endDate)}
              </p>
            </div>
          </div>

          {dateRange.length > 0 && (
            <div className="bg-[#FAFAFA] border border-border rounded-lg px-4 py-3">
              <p className="text-xs text-[#666] mb-2 font-medium">
                Playing days ({dateRange.length})
              </p>
              <ul className="flex flex-wrap gap-2">
                {dateRange.map((d, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-xs text-[#333] font-medium"
                  >
                    <LuCircleCheck className="text-emerald-500 w-3.5 h-3.5" />
                    {d.day}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Other Info ───────────────────────────────────────── */}
      <SectionCard
        icon={<LuInfo />}
        title="Camp Info"
        description="Status, pricing and metadata"
      >
        <div className="p-5 sm:p-7 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <LuDollarSign />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#666]">Camp Fee</p>
              <p className="text-[15px] text-[#333]">{price}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <LuTrophy />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#666]">Status</p>
              <p className="text-[15px] text-[#333] capitalize">{status || "—"}</p>
            </div>
          </div>

          {campData?.created_at && (
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <LuClock />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[#666]">Created</p>
                <p className="text-[15px] text-[#333]">
                  {formatDate(campData.created_at)}
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Manage Camp — assign assistant directors */}
      <ManageCampModal
        open={manageCampOpen}
        onClose={() => setManageCampOpen(false)}
        campName={campData?.camp_name}
        assistants={assistants}
        onAssign={handleAssignAssistant}
        onRemove={handleRemoveAssistant}
      />
    </div>
  );
};

export default CampOverview;
