import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCountdown from "@/hooks/useCountdown";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Swal from "sweetalert2";
import { usePublicCampDetails } from "@/hooks/api/useNoAuthCamps";
import dayjs from "dayjs";
import { formatPrice, getDurationDays } from "@/utils/campFormat";

import CampDetailsSkeleton from "./components/CampDetailsSkeleton";
import CampDetailsError from "./components/CampDetailsError";
import CampHeroSection from "./components/CampHeroSection";
import CampStatsGrid from "./components/CampStatsGrid";
import CampAboutSection from "./components/CampAboutSection";
import CampDirectorSection from "./components/CampDirectorSection";
import CampStickySidebar from "./components/CampStickySidebar";
import CampBottomCta from "./components/CampBottomCta";
import CampMobileStickyBar from "./components/CampMobileStickyBar";

const STATUS_META = {
  upcoming: {
    label: "Upcoming",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  active: {
    label: "Open",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  open: {
    label: "Open",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  completed: {
    label: "Completed",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
  },
  closed: {
    label: "Closed",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
};

const getStatusMeta = (status) =>
  STATUS_META[String(status || "").toLowerCase()] || {
    label: status || "—",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
  };

const CampDetailsPageForNoAuth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: campDetails,
    isLoading,
    isError,
    refetch,
  } = usePublicCampDetails(id);

  const [showMobileBar, setShowMobileBar] = useState(false);

  // Show the sticky mobile CTA once the visitor scrolls past the hero.
  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const camp = campDetails || {};

  useDocumentTitle(camp.camp_name);

  const statusMeta = getStatusMeta(camp.status);
  const price = useMemo(() => formatPrice(camp.price), [camp.price]);
  const durationDays = useMemo(
    () => getDurationDays(camp.start_date, camp.end_date),
    [camp.start_date, camp.end_date],
  );

  // Countdown only makes sense when the camp hasn't started yet.
  const isUpcoming =
    camp.status?.toLowerCase() === "upcoming" ||
    (camp.start_date && dayjs(camp.start_date).valueOf() > Date.now());
  const countdown = useCountdown(isUpcoming ? camp.start_date : null);

  const handleRegisterClick = () => {
    Swal.fire({
      icon: "info",
      title: "Ready to Join the Camp?",
      html: `
        <p class="text-gray-700 mb-6">
          You need to <strong>create an account</strong> or <strong>log in</strong> to register for this camp.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Sign Up",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#10b981",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        cancelButton:
          "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        popup: "rounded-2xl mx-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      const intendedPath = `/camp/details/${id}`;

      if (result.isConfirmed) {
        navigate("/auth/signin", { state: { from: intendedPath } });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/auth/signup", { state: { from: intendedPath } });
      }
    });
  };

  /* ── Loading skeleton ─────────────────────────────────────── */
  if (isLoading) {
    return <CampDetailsSkeleton />;
  }

  /* ── Error state ──────────────────────────────────────────── */
  if (isError || !campDetails) {
    return <CampDetailsError onRetry={() => refetch()} />;
  }

  const {
    camp_name = "Untitled Camp",
    camp_logo,
    sports_type_name = "Sports Camp",
    location = "Location not specified",
    start_date,
    end_date,
    camp_details,
    director = {},
  } = camp;

  const {
    name: directorName = "Camp Director",
    avatar: directorAvatar,
    email: directorEmail,
    phone: directorPhone,
    address: directorAddress,
  } = director;

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-0">
      {/* ══ Hero ═════════════════════════════════════════════════ */}
      <CampHeroSection
        campName={camp_name}
        campLogo={camp_logo}
        sportsTypeName={sports_type_name}
        location={location}
        startDate={start_date}
        endDate={end_date}
        statusMeta={statusMeta}
        durationDays={durationDays}
        onRegisterClick={handleRegisterClick}
      />

      {/* ══ Main content ═════════════════════════════════════════ */}
      <div
        id="camp-details"
        className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 sm:-mt-28 relative z-10"
      >
        {/* At-a-glance strip */}
        <CampStatsGrid
          startDate={start_date}
          endDate={end_date}
          sportsTypeName={sports_type_name}
          location={location}
          price={price}
        />

        {/* Two-column layout: content + sticky register card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8 sm:mt-12">
          {/* ── Left column ── */}
          <div className="space-y-8">
            {/* About the camp */}
            <CampAboutSection campDetails={camp_details} />

            {/* Camp director */}
            <CampDirectorSection
              directorName={directorName}
              directorAvatar={directorAvatar}
              directorEmail={directorEmail}
              directorPhone={directorPhone}
              directorAddress={directorAddress}
            />
          </div>

          {/* ── Right column: sticky registration card ── */}
          <CampStickySidebar
            price={price}
            statusMeta={statusMeta}
            countdown={countdown}
            startDate={start_date}
            endDate={end_date}
            sportsTypeName={sports_type_name}
            location={location}
            durationDays={durationDays}
            onRegisterClick={handleRegisterClick}
          />
        </div>

        {/* Desktop bottom CTA banner */}
        <CampBottomCta
          campName={camp_name}
          directorName={directorName}
          sportsTypeName={sports_type_name}
          onRegisterClick={handleRegisterClick}
        />
      </div>

      {/* ══ Mobile sticky CTA bar ═══════════════════════════════ */}
      <CampMobileStickyBar
        showMobileBar={showMobileBar}
        price={price}
        statusMeta={statusMeta}
        onRegisterClick={handleRegisterClick}
      />
    </div>
  );
};

export default CampDetailsPageForNoAuth;
