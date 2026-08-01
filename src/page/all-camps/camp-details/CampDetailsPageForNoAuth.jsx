import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCountdown from "@/hooks/useCountdown";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiHome,
  FiArrowLeft,
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";
import {
  IoTrophyOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoCloudOfflineOutline,
} from "react-icons/io5";
import { MdOutlineSportsTennis, MdVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { usePublicCampDetails } from "@/hooks/api/useNoAuthCamps";
import dummyImage from "@/assets/dummyCardImg.png";
import dayjs from "dayjs";
import { formatDate, formatPrice, getDurationDays } from "@/utils/campFormat";

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

/* ── Motion presets ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ── Component ───────────────────────────────────────────────── */

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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-72 sm:h-96 bg-linear-to-r from-primary to-sky-600 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-100 my-8" />
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-5/6 bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────── */
  if (isError || !campDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <IoCloudOfflineOutline className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            We couldn&apos;t load this camp
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Something went wrong while fetching the camp details. Check your
            connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            to="/all-camps"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mt-4 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to all camps
          </Link>
        </div>
      </div>
    );
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
      <section className="relative bg-linear-to-br from-[#0b1220] via-[#16213b] to-[#0a0f1c] overflow-hidden">
        {/* Blurred camp logo as ambient background */}
        {camp_logo && (
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={camp_logo}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-75 scale-105 blur-xl brightness-90 saturate-150"
            />
          </div>
        )}

        {/* Legibility overlay on top of the ambient image */}
        <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/25 to-black/60" />

        {/* Decorative layers */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_0%,white,transparent_40%),radial-gradient(circle_at_70%_90%,white,transparent_45%)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-36 sm:pb-44">
          {/* Breadcrumb + back */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-10"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <FiChevronRight className="w-3.5 h-3.5 text-white/50" />
              <li>
                <Link
                  to="/all-camps"
                  className="hover:text-white transition-colors"
                >
                  All Camps
                </Link>
              </li>
              <FiChevronRight className="w-3.5 h-3.5 text-white/50" />
              <li className="text-white font-medium truncate max-w-28 sm:max-w-56">
                {camp_name}
              </li>
            </ol>
            <Link
              to="/all-camps"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3.5 py-1.5 transition-all"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              All Camps
            </Link>
          </motion.nav>

          {/* Hero content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            <motion.div variants={fadeUp} className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/30 blur-lg scale-125" />
                <img
                  src={camp_logo || dummyImage}
                  alt={`${camp_name} logo`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = dummyImage;
                  }}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-contain bg-white p-2.5 sm:p-3 shadow-2xl ring-4 ring-white/25"
                />
                <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                  <MdVerified className="w-4 h-4 text-white" />
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-2 mb-4 flex-wrap"
            >
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusMeta.badge}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {statusMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white border border-white/25">
                <MdOutlineSportsTennis className="w-3.5 h-3.5" />
                {sports_type_name}
              </span>
              {durationDays && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white border border-white/25">
                  <IoTimeOutline className="w-3.5 h-3.5" />
                  {durationDays} {durationDays === 1 ? "day" : "days"}
                </span>
              )}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-tight mb-5 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
            >
              {camp_name}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="flex items-center justify-center gap-2 text-white/90 text-sm sm:text-base mb-9 flex-wrap drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
            >
              <FiMapPin className="w-4 h-4 shrink-0" />
              <span className="capitalize">{location}</span>
              <span className="text-white/40 mx-1">•</span>
              <FiCalendar className="w-4 h-4 shrink-0" />
              <span>
                {formatDate(start_date)}
                {end_date && ` – ${formatDate(end_date)}`}
              </span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                type="button"
                onClick={handleRegisterClick}
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
              >
                Register Now
                <FiChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#camp-details"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold text-base px-8 py-3.5 rounded-full transition-all cursor-pointer w-full sm:w-auto"
              >
                Explore Details
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ Main content ═════════════════════════════════════════ */}
      <div
        id="camp-details"
        className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 sm:-mt-28 relative z-10"
      >
        {/* At-a-glance strip */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {[
              {
                icon: <FiCalendar className="w-5 h-5" />,
                tint: "bg-primary/10 text-primary",
                label: "Camp Dates",
                value: `${formatDate(start_date)} – ${formatDate(end_date)}`,
              },
              {
                icon: <MdOutlineSportsTennis className="w-5 h-5" />,
                tint: "bg-violet-50 text-violet-600",
                label: "Sport",
                value: sports_type_name,
              },
              {
                icon: <FiMapPin className="w-5 h-5" />,
                tint: "bg-emerald-50 text-emerald-600",
                label: "Location",
                value: location,
              },
              {
                icon: <FiDollarSign className="w-5 h-5" />,
                tint: "bg-amber-50 text-amber-600",
                label: "Camp Fee",
                value: price,
              },
            ].map(({ icon, tint, label, value }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="p-5 sm:p-6 flex items-start gap-3.5 hover:bg-gray-50/70 transition-colors bg-white"
              >
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tint}`}
                >
                  {icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">
                    {label}
                  </p>
                  <p className="text-sm sm:text-[15px] font-semibold text-gray-900 capitalize truncate">
                    {value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout: content + sticky register card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8 sm:mt-12">
          {/* ── Left column ── */}
          <div className="space-y-8">
            {/* About the camp */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-9"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <IoTrophyOutline className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  About the Camp
                </h2>
              </div>
              <div
                className="camp-rich-content"
                dangerouslySetInnerHTML={{
                  __html: camp_details || "<p>No description available.</p>",
                }}
              />
            </motion.section>

            {/* Camp director */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-9"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <FiHome className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Meet Your Camp Director
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="relative shrink-0">
                  <img
                    src={directorAvatar || dummyImage}
                    alt={directorName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = dummyImage;
                    }}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg ring-4 ring-white border border-gray-100"
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    Camp Director
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
                    {directorName}
                  </h3>
                  <div className="space-y-3.5 text-sm text-gray-600">
                    {directorEmail && (
                      <a
                        href={`mailto:${directorEmail}`}
                        className="flex items-center justify-center sm:justify-start gap-3 hover:text-primary transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <FiMail className="w-4 h-4" />
                        </span>
                        <span className="break-all">{directorEmail}</span>
                      </a>
                    )}
                    {directorPhone && (
                      <a
                        href={`tel:${directorPhone}`}
                        className="flex items-center justify-center sm:justify-start gap-3 hover:text-primary transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <FiPhone className="w-4 h-4" />
                        </span>
                        <span>{directorPhone}</span>
                      </a>
                    )}
                    {directorAddress && (
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                          <FiHome className="w-4 h-4" />
                        </span>
                        <span className="break-words">{directorAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* ── Right column: sticky registration card ── */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:sticky lg:top-8 h-fit"
            aria-label="Registration"
          >
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 overflow-hidden">
              {/* Card header */}
              <div className="relative bg-linear-to-br from-primary to-[#0b6fb3] px-6 py-5 overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_80%_20%,white,transparent_50%)]" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs uppercase tracking-wider font-semibold mb-1">
                      Camp Fee
                    </p>
                    <p className="text-3xl font-bold text-white">{price}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusMeta.badge}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusMeta.label}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Countdown */}
                {countdown && (
                  <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                      <IoTimeOutline className="w-3.5 h-3.5 text-primary" />
                      Camp starts in
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: countdown.days, l: "Days" },
                        { v: countdown.hours, l: "Hrs" },
                        { v: countdown.minutes, l: "Min" },
                        { v: countdown.seconds, l: "Sec" },
                      ].map(({ v, l }) => (
                        <div
                          key={l}
                          className="bg-gray-50 border border-gray-100 rounded-xl py-3 text-center"
                        >
                          <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
                            {String(v).padStart(2, "0")}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            {l}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key facts */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <FiCalendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-gray-600">
                      {formatDate(start_date)} – {formatDate(end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MdOutlineSportsTennis className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-gray-600 capitalize">
                      {sports_type_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FiMapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-gray-600 capitalize">{location}</span>
                  </div>
                  {durationDays && (
                    <div className="flex items-center gap-3 text-sm">
                      <IoTimeOutline className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-gray-600">
                        {durationDays} {durationDays === 1 ? "day" : "days"} of
                        training
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="w-full bg-primary hover:bg-[#0099d4] text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  Register Now
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Free account · Takes under a minute
                </p>

                {/* How it works */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-4">
                    What happens next
                  </p>
                  <ol className="space-y-3">
                    {[
                      "Create your free referee account",
                      "Register for this camp in one click",
                      "Receive your schedule & camp updates",
                    ].map((step) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FiCheck className="w-3 h-3" />
                        </span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Trust note */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                  <IoShieldCheckmarkOutline className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure &amp; managed by Whistle Works</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Desktop bottom CTA banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="hidden lg:block py-12"
        >
          <div className="relative bg-linear-to-r from-primary via-[#0095d6] to-[#0b6fb3] rounded-3xl overflow-hidden px-10 py-10 text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_15%_100%,white,transparent_45%),radial-gradient(circle_at_85%_0%,white,transparent_40%)]" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to take your officiating to the next level?
              </h3>
              <p className="text-white/85 text-sm mb-6 max-w-xl mx-auto">
                Join {camp_name} and train with {directorName} — spots fill up
                fast for {sports_type_name} camps.
              </p>
              <button
                type="button"
                onClick={handleRegisterClick}
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-base px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Register Now
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══ Mobile sticky CTA bar ═══════════════════════════════ */}
      <div
        aria-hidden={!showMobileBar}
        inert={!showMobileBar}
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ease-out ${
          showMobileBar
            ? "translate-y-0"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
              Camp Fee
            </p>
            <p className="text-lg font-bold text-gray-900 leading-tight truncate">
              {price}
              <span className="text-xs font-medium text-gray-400 ml-1.5">
                · {statusMeta.label}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="shrink-0 bg-primary hover:bg-[#0099d4] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampDetailsPageForNoAuth;
