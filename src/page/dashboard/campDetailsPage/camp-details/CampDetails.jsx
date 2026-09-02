import { Image, Spin } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import useCountdown from "@/hooks/useCountdown";
import { useAuth } from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import dummyImage from "@/assets/dummyCardImg.png";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SectionCard from "@/components/common/SectionCard";
import {
  formatDate,
  formatPrice,
  getDurationDays,
} from "@/utils/campFormat";
import RegistrationModal from "./components/RegistrationModal";
import {
  useCancelRegistration,
  useMyRegistrations,
} from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import {
  LuCalendarDays,
  LuMapPin,
  LuDollarSign,
  LuClock,
  LuTrophy,
  LuFileText,
  LuHouse,
  LuMail,
  LuPhone,
  LuUserRound,
  LuLayoutGrid,
  LuCheck,
  LuX,
  LuTimer,
} from "react-icons/lu";
import { MdOutlineSportsTennis } from "react-icons/md";

export default function CampDetails({ campData, onRegistrationUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const { userData } = useAuth();
  const axiosSecure = useAxiosSecure();

  const isEvaluator = userData?.role === "evaluator";
  const isReferee = userData?.role === "referee";

  const cancelRegistration = useCancelRegistration();

  // Fetch all registrations to find the registration ID for this camp
  const { registrations } = useMyRegistrations(1, 100);

  const currentRegistration = isEvaluator
    ? registrations.find((reg) => reg.camp?.id === campData?.id)
    : null;
  const evaluatorRegistrationId = currentRegistration?.id;

  const {
    id: campId,
    camp_name = "Untitled Camp",
    camp_logo,
    director = {}, // fallback to empty object
    location: campLocation = "Location not specified",
    start_date,
    end_date,
    camp_details = "No description available.",
    sports_type_name = "Unknown Sport",
    price = "N/A",
    referee_registration_status: refereeStatus,
    evaluator_registration_status: evaluatorStatus,
  } = campData || {};

  // Destructure director info with fallbacks
  const {
    name: directorName = "Director name not available",
    avatar: directorAvatar,
    email: directorEmail = "N/A",
    phone: directorPhone = "N/A",
    address: directorAddress = "N/A",
  } = director;

  const durationDays = getDurationDays(start_date, end_date);

  // Live countdown until the camp starts (only for upcoming camps)
  const isUpcoming =
    start_date && dayjs(start_date).valueOf() > Date.now();
  const countdown = useCountdown(isUpcoming ? start_date : null);

  const handleAction = async () => {
    let endpoint = "";
    let payload = {};
    let successMessage = "";
    let newStatusField = "";
    let newStatusValue = "";

    if (isEvaluator) {
      endpoint = `/evaluator/camp-registration/register`;
      payload = { camp_id: campId };
      successMessage = "Registration submitted successfully. Waiting for director approval.";
      newStatusField = "evaluator_registration_status";
      newStatusValue = "pending";
    } else if (isReferee && refereeStatus === "registered") {
      endpoint = `/v1/referee/camp/${campId}/checkin`;
      payload = {};
      successMessage = "Checked In Successfully!";
      newStatusField = "referee_registration_status";
      newStatusValue = "checked_in";
    }

    // For referee registration (not already registered/checked-in), open the pricing/coupon modal
    if (isReferee && refereeStatus !== "registered" && refereeStatus !== "checked_in") {
      setShowRegistrationModal(true);
      return;
    }

    // For evaluator registration or referee check-in, use Swal.confirm
    await Swal.fire({
      title: isEvaluator
        ? "Evaluator Registration Confirmation"
        : "Camp Check In Confirmation",
      html: `
        <div class="text-center">
          <p class="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
            ${isEvaluator
          ? "I confirm I want to register as an evaluator for this camp."
          : "I have physically arrived at camp and am ready to begin training."
        }
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: loading ? "Processing..." : "Proceed",
      cancelButtonText: "Go Back",
      width: 520,
      padding: "2.5rem",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "bg-[#00AEEF] hover:bg-[#0099d4] text-white font-medium rounded-lg px-8 py-3 text-lg",
        cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-8 py-3 text-lg ml-3",
      },
      buttonsStyling: false,
      preConfirm: async () => {
        setLoading(true);
        try {
          const response = await axiosSecure.post(endpoint, payload);

          const { success, data } = response.data;

          if (success) {
            if (data?.payment_required && data?.checkout_url) {
              Swal.close();
              window.location.href = data.checkout_url;
              return;
            }

            toast.success(successMessage);

            onRegistrationUpdate?.({
              ...campData,
              [newStatusField]: newStatusValue,
            });
          }
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Operation failed. Please try again.";

          Swal.showValidationMessage(`<i>${errorMsg}</i>`);
        } finally {
          setLoading(false);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  // ── Cancel registration handler ────────────────────────────
  const handleCancelRegistration = () => {
    Swal.fire({
      title: "Cancel Registration?",
      html: `<p class="text-gray-600">Are you sure you want to cancel your registration for <strong>${camp_name}</strong>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep Registration",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-6 py-2.5",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-6 py-2.5",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && evaluatorRegistrationId) {
        cancelRegistration.mutate(evaluatorRegistrationId);
      }
    });
  };

  // Callback when registration modal completes successfully
  const handleRegistrationSuccess = () => {
    onRegistrationUpdate?.({
      ...campData,
      referee_registration_status: "registered",
    });
  };

  const currentStatus = isEvaluator ? evaluatorStatus : refereeStatus;

  const showButton = (() => {
    if (!isReferee && !isEvaluator) return false;
    if (isEvaluator) {
      return !currentStatus || currentStatus === "rejected";
    }
    if (isReferee) {
      return currentStatus !== "checked_in";
    }
    return false;
  })();

  const buttonText = (() => {
    if (isEvaluator) return "Register as Evaluator";
    if (isReferee && refereeStatus === "registered") return "Check In";
    return "Register";
  })();

  const statusBadge = (() => {
    if (!currentStatus) return null;

    if (isEvaluator) {
      if (currentStatus === "pending")
        return { text: "Pending Approval", className: "bg-amber-50 text-amber-700 border border-amber-200" };
      if (currentStatus === "approved")
        return { text: "Approved", className: "bg-green-50 text-green-700 border border-green-200" };
      if (currentStatus === "rejected")
        return { text: "Rejected", className: "bg-red-50 text-red-600 border border-red-200" };
    } else {
      if (currentStatus === "checked_in")
        return { text: "Checked In", className: "bg-green-50 text-green-700 border border-green-200" };
      if (currentStatus === "registered")
        return { text: "Registered", className: "bg-sky-50 text-sky-700 border border-sky-200" };
    }
    return null;
  })();

  /* ── At-a-glance stats ───────────────────────────────────── */
  const stats = [
    {
      label: "Camp Dates",
      value: `${formatDate(start_date)} – ${formatDate(end_date)}`,
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
      value: sports_type_name,
      icon: <MdOutlineSportsTennis />,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Camp Fee",
      value: formatPrice(price),
      icon: <LuDollarSign />,
      tint: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-4 mt-10">
      {/* ── Overview header card ─────────────────────────────── */}
      <div className="bg-white border border-border rounded-[10px] overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-border">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-full overflow-hidden border-2 border-primary/15 flex items-center justify-center bg-gray-50">
                <Image
                  src={camp_logo || dummyImage}
                  alt={camp_name}
                  width={60}
                  height={60}
                  preview={false}
                  className="rounded-full object-cover w-full h-full"
                  wrapperClassName="shrink-0 w-full h-full flex items-center justify-center"
                  wrapperStyle={{ flexShrink: 0, width: "100%", height: "100%" }}
                  fallback={dummyImage}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-semibold text-[#333] leading-tight break-words">
                  {camp_name}
                </h2>
                <p className="text-xs sm:text-sm text-[#666] mt-1 flex items-center gap-1.5 flex-wrap">
                  <MdOutlineSportsTennis className="text-primary shrink-0" />
                  <span className="capitalize">{sports_type_name}</span>
                  <span className="text-[#ccc]">•</span>
                  <LuMapPin className="text-primary shrink-0" />
                  <span className="capitalize">{campLocation}</span>
                </p>
              </div>
            </div>

            {statusBadge && (
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusBadge.className}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {statusBadge.text}
              </span>
            )}
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
                  <p className="text-xs text-[#666]">{formatDate(start_date)}</p>
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
              __html: camp_details || "<p>No description available.</p>",
            }}
          />
        </div>
      </SectionCard>

      {/* ── Venue + Director (side by side on desktop) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Venue Information */}
        <SectionCard
          icon={<LuLayoutGrid />}
          title="Venue Information"
          description="Where the camp takes place"
        >
          <div className="p-5 sm:p-7 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <LuMapPin />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[#666] mb-0.5">Facility</p>
                <p className="text-[15px] text-[#333] capitalize">
                  {campLocation}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <LuCalendarDays />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[#666] mb-0.5">Camp Dates</p>
                <p className="text-[15px] text-[#333]">
                  {formatDate(start_date)} – {formatDate(end_date)}
                </p>
                {durationDays && (
                  <p className="text-xs text-[#999] mt-0.5">
                    {durationDays} {durationDays === 1 ? "day" : "days"} total
                  </p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Director Information */}
        <SectionCard
          icon={<LuUserRound />}
          title="Camp Director"
          description="Your point of contact for this camp"
        >
          <div className="p-5 sm:p-7">
            <div className="flex items-center gap-4 mb-6 min-w-0">
              <div className="shrink-0 w-[56px] h-[56px] min-w-[56px] min-h-[56px] rounded-full overflow-hidden border-2 border-primary/15 flex items-center justify-center bg-gray-50">
                <Image
                  src={directorAvatar || dummyImage}
                  alt={directorName}
                  width={56}
                  height={56}
                  preview={false}
                  className="rounded-full object-cover w-full h-full"
                  wrapperClassName="shrink-0 w-full h-full flex items-center justify-center"
                  wrapperStyle={{ flexShrink: 0, width: "100%", height: "100%" }}
                  fallback={dummyImage}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-[#333] truncate">
                  {directorName}
                </p>
                <p className="text-xs text-[#666]">Camp Director</p>
              </div>
            </div>

            <div className="space-y-3">
              {directorEmail !== "N/A" && (
                <a
                  href={`mailto:${directorEmail}`}
                  className="flex items-center gap-3 group hover:bg-[#FAFAFA] rounded-lg px-2 py-2 -mx-2 transition-colors"
                >
                  <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <LuMail />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#666]">Email</p>
                    <p className="text-sm text-[#333] truncate">
                      {directorEmail}
                    </p>
                  </div>
                </a>
              )}

              {directorPhone !== "N/A" && (
                <a
                  href={`tel:${directorPhone}`}
                  className="flex items-center gap-3 group hover:bg-[#FAFAFA] rounded-lg px-2 py-2 -mx-2 transition-colors"
                >
                  <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <LuPhone />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#666]">Phone</p>
                    <p className="text-sm text-[#333] truncate">
                      {directorPhone}
                    </p>
                  </div>
                </a>
              )}

              {directorAddress !== "N/A" && (
                <div className="flex items-center gap-3 px-2 py-2 -mx-2">
                  <span className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <LuHouse />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[#666]">Address</p>
                    <p className="text-sm text-[#333] break-words">
                      {directorAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      {showButton && (
        <button
          onClick={handleAction}
          disabled={loading}
          className="w-full bg-primary hover:bg-[#0099d4] text-white font-semibold py-4 px-8 rounded-[10px] flex items-center justify-center gap-2 mt-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spin size="small" className="[&_.ant-spin-dot-item]:bg-white" />
              Processing...
            </>
          ) : (
            <>
              {isEvaluator ? (
                <LuTrophy className="w-5 h-5" />
              ) : (
                <LuCheck className="w-5 h-5" />
              )}
              {buttonText}
            </>
          )}
        </button>
      )}

      {/* Cancel Registration Button — Evaluator with pending status */}
      {isEvaluator && evaluatorStatus === "pending" && evaluatorRegistrationId && (
        <button
          onClick={handleCancelRegistration}
          disabled={cancelRegistration.isPending}
          className="w-full py-4 px-8 rounded-[10px] border border-red-200 text-red-600 font-medium
            hover:bg-red-50 hover:border-red-300 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {cancelRegistration.isPending ? (
            <>
              <Spin size="small" />
              Cancelling...
            </>
          ) : (
            <>
              <LuX className="w-5 h-5" />
              Cancel Registration
            </>
          )}
        </button>
      )}

      {/* Registration Pricing & Coupon Modal */}
      <RegistrationModal
        open={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        campId={campId}
        campName={camp_name}
        sportsName={sports_type_name}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
