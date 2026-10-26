import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import ScreenLoading from "@/components/common/ScreenLoading";
import SectionCard from "@/components/common/SectionCard";
import ScheduleTimezone from "@/components/common/ScheduleTimezone";
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
  useAssignAssistantDirector,
  useGetAllDirectors,
  useRemoveAssistantDirector,
} from "@/hooks/api/director-hooks/useCamps";
import toast from "react-hot-toast";
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
import SportIcon from "@/components/shared/SportIcon";
import ManageCampModal from "./components/ManageCampModal";

const parseBool = (val) => val === true || val === 1 || val === "1" || val === "true";

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

  const { data: campData, isLoading, refetch: refetchCampDetails } = useGetCampDetails(id);
  const { data: allDirectors = [], refetch: refetchAllDirectors } = useGetAllDirectors("", id);

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

  const assignMutation = useAssignAssistantDirector({
    onSuccess: () => {
      toast.success("Assistant director assigned successfully.");
      refetchCampDetails();
      refetchAllDirectors();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to assign assistant director.");
    },
  });

  const removeMutation = useRemoveAssistantDirector({
    onSuccess: () => {
      toast.success("Assistant director removed successfully.");
      refetchCampDetails();
      refetchAllDirectors();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to remove assistant director.");
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

  const assistantsList = useMemo(() => {
    // 1. Prioritize from allDirectors query if available and has assigned directors
    const assignedFromList = (allDirectors || []).filter((d) => d.is_assigned);
    if (assignedFromList.length > 0) {
      return assignedFromList.map((dir) => {
        const permObj = dir.permissions || {};
        const uiPermissions = [];
        if (parseBool(permObj.build_schedule) || parseBool(permObj.manage_schedule)) uiPermissions.push("manage_schedule");
        if (parseBool(permObj.assign_referees) || parseBool(permObj.assign_referee)) uiPermissions.push("assign_referee");
        if (parseBool(permObj.publish_camp)) uiPermissions.push("publish_camp");
        if (parseBool(permObj.manage_ranking_reports) || parseBool(permObj.manage_ranking)) uiPermissions.push("manage_ranking");
        if (parseBool(permObj.manage_roster_referees)) uiPermissions.push("manage_roster_referees");
        if (parseBool(permObj.manage_roster_evaluators)) uiPermissions.push("manage_roster_evaluators");
        if (parseBool(permObj.manage_roster_crews)) uiPermissions.push("manage_roster_crews");
        if (parseBool(permObj.manage_announcements) || parseBool(permObj.manage_announcement)) uiPermissions.push("manage_announcement");

        return {
          id: dir.id,
          name: `${dir.first_name || ""} ${dir.last_name || ""}`.trim() || dir.email,
          email: dir.email,
          permissions: uiPermissions,
        };
      });
    }

    // 2. Fallback to campData assistant directors list
    const directList = campData?.assistant_directors || campData?.assistants || [];
    if (directList.length > 0) {
      return directList.map((item) => {
        let permObj = {};
        if (campData?.permissions) {
          const found = Object.values(campData.permissions).find(
            (p) => p.assistant_director_id === item.id
          );
          if (found) permObj = found;
        }
        if (!permObj.id) {
          permObj = item.pivot || item.permissions || {};
        }

        const uiPermissions = [];
        if (parseBool(permObj.build_schedule) || parseBool(permObj.manage_schedule)) uiPermissions.push("manage_schedule");
        if (parseBool(permObj.assign_referees) || parseBool(permObj.assign_referee)) uiPermissions.push("assign_referee");
        if (parseBool(permObj.publish_camp)) uiPermissions.push("publish_camp");
        if (parseBool(permObj.manage_ranking_reports) || parseBool(permObj.manage_ranking)) uiPermissions.push("manage_ranking");
        if (parseBool(permObj.manage_roster_referees)) uiPermissions.push("manage_roster_referees");
        if (parseBool(permObj.manage_roster_evaluators)) uiPermissions.push("manage_roster_evaluators");
        if (parseBool(permObj.manage_roster_crews)) uiPermissions.push("manage_roster_crews");
        if (parseBool(permObj.manage_announcements) || parseBool(permObj.manage_announcement)) uiPermissions.push("manage_announcement");

        return {
          id: item.id,
          name: item.name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.email,
          email: item.email,
          permissions: uiPermissions,
        };
      });
    }

    // 3. Fallback to mapping permissions directly if directList is not yet resolved
    if (campData?.permissions && allDirectors.length > 0) {
      const activePermissions = Object.values(campData.permissions);
      return activePermissions
        .map((permObj) => {
          const dir = allDirectors.find((d) => d.id === permObj.assistant_director_id);
          if (!dir) return null;

          const uiPermissions = [];
          if (parseBool(permObj.build_schedule) || parseBool(permObj.manage_schedule)) uiPermissions.push("manage_schedule");
          if (parseBool(permObj.assign_referees) || parseBool(permObj.assign_referee)) uiPermissions.push("assign_referee");
          if (parseBool(permObj.publish_camp)) uiPermissions.push("publish_camp");
          if (parseBool(permObj.manage_ranking_reports) || parseBool(permObj.manage_ranking)) uiPermissions.push("manage_ranking");
          if (parseBool(permObj.manage_roster_referees)) uiPermissions.push("manage_roster_referees");
          if (parseBool(permObj.manage_roster_evaluators)) uiPermissions.push("manage_roster_evaluators");
          if (parseBool(permObj.manage_roster_crews)) uiPermissions.push("manage_roster_crews");
          if (parseBool(permObj.manage_announcements) || parseBool(permObj.manage_announcement)) uiPermissions.push("manage_announcement");

          return {
            id: dir.id,
            name: `${dir.first_name || ""} ${dir.last_name || ""}`.trim() || dir.email,
            email: dir.email,
            permissions: uiPermissions,
          };
        })
        .filter(Boolean);
    }

    return [];
  }, [campData, allDirectors]);

  const handleAssignAssistant = (director, permissionKeys) => {
    const payload = {
      assistant_director_id: director.id,
      camp_id: parseInt(id),
      build_schedule: (permissionKeys.includes("build_schedule") || permissionKeys.includes("manage_schedule")) ? 1 : 0,
      assign_referees: permissionKeys.includes("assign_referee") ? 1 : 0,
      publish_camp: permissionKeys.includes("publish_camp") ? 1 : 0,
      manage_ranking_reports: permissionKeys.includes("manage_ranking") ? 1 : 0,
      manage_roster: (
        permissionKeys.includes("manage_roster_referees") ||
        permissionKeys.includes("manage_roster_evaluators") ||
        permissionKeys.includes("manage_roster_crews")
      ) ? 1 : 0,
      manage_roster_referees: permissionKeys.includes("manage_roster_referees") ? 1 : 0,
      manage_roster_evaluators: permissionKeys.includes("manage_roster_evaluators") ? 1 : 0,
      manage_roster_crews: permissionKeys.includes("manage_roster_crews") ? 1 : 0,
      manage_announcements: permissionKeys.includes("manage_announcement") ? 1 : 0,
    };

    assignMutation.mutate(payload);
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

    removeMutation.mutate({ assistantId, campId: parseInt(id) });
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
      value: campData?.sport?.sports_name || campData?.sports_type_name || "—",
      icon: <SportIcon sport={campData?.sport || campData?.sports_type_name} />,
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
                  <SportIcon
                    sport={campData?.sport || campData?.sports_type_name}
                    className="text-primary shrink-0"
                  />
                  <span className="capitalize">
                    {campData?.sport?.sports_name || campData?.sports_type_name || "—"}
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
                      className="flex items-center justify-center gap-1.5 px-3 sm:px-4"
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
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

          {campData?.timezone && (
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <LuClock aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-[#666] mb-0.5">Timezone</p>
                <ScheduleTimezone timezones={campData.timezone} date={startDate} className="text-[15px] text-[#333]" />
              </div>
            </div>
          )}

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
        campId={id}
        assistants={assistantsList}
        onAssign={handleAssignAssistant}
        onRemove={handleRemoveAssistant}
      />
    </div>
  );
};

export default CampOverview;
