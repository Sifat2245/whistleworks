import { motion } from "framer-motion";
import {
  FaLocationDot,
  FaCalendarDays,
  FaCheck,
  FaArrowRight
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import defaultCampBg from "@/assets/banner-images/photo-1634306320577-eb8f44e6ab96.webp";

// Helper to calculate duration in days between two dates
const getDurationText = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return "3 Days";
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (!isNaN(diffDays) && diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? "Day" : "Days"}`;
    }
  } catch {
    // fallback
  }
  return "3 Days";
};

// Helper to extract 2-letter monogram initials from string
const getInitials = (nameStr = "") => {
  if (!nameStr) return "GL";
  const words = nameStr.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return nameStr.substring(0, 2).toUpperCase();
};

const CampCard = ({ camp }) => {
  const { userData, isLoggedIn } = useAuth();
  const userRole = userData?.role?.toLowerCase();

  const {
    id: campId,
    camp_name,
    camp_logo,
    image,
    banner_image,
    cover_image,
    location: campLocation,
    start_date,
    end_date,
    price,
    sports_type,
    director,
  } = camp || {};

  // Determine card background image from camp data
  const cardBgImage = image || banner_image || cover_image || camp_logo || defaultCampBg;

  const displayPrice = price && parseFloat(price) > 0 ? `$${parseFloat(price).toFixed(0)}` : "Free";

  const durationText = getDurationText(start_date, end_date);
  const initials = getInitials(camp_name || director?.name || "Whistle Works");

  const getButtonPath = () => {
    if (!isLoggedIn) {
      return `/all-camps/${campId}`;
    }
    if (userRole === "director") {
      return `/director-dashboard/camp-overview/${campId}`;
    }
    if (userRole === "evaluator") {
      return `/evaluator-dashboard/camp/${campId}?tab=camp-details`;
    }
    if (userRole === "referee") {
      return `/referee-dashboard/camp/${campId}?tab=camp-details`;
    }
    return `/camp/details/${campId}`;
  };

  const buttonPath = getButtonPath();

  const getButtonText = () => {
    if (!isLoggedIn) {
      return "Register";
    }
    return userRole === "director" ? "Manage" : "Register";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[460px] w-full max-w-[390px] sm:max-w-[420px] mx-auto border border-slate-700/60 shadow-xl hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 text-white"
    >
      {/* Full-bleed Card Background Image with Smooth Scale */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 z-0"
        style={{ backgroundImage: `url(${cardBgImage})` }}
      />

      {/* Dark Vignette Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 z-10 pointer-events-none" />

      {/* Top Bar: Logo Monogram & Status Badge */}
      <div className="relative z-20 flex items-start justify-between">
        {/* Monogram Box / Camp Logo */}
        <div className="relative w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center font-black text-white text-base shadow-xl shrink-0 overflow-visible">
          {camp_logo ? (
            <img
              src={camp_logo}
              alt={camp_name || "Camp Logo"}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <span
            className="w-full h-full rounded-2xl flex items-center justify-center font-black text-white text-base bg-slate-900"
            style={{ display: camp_logo ? "none" : "flex" }}
          >
            {initials}
          </span>

          {/* Verified Badge Check Dot */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-slate-950 text-[10px] font-bold shadow-md">
            <FaCheck />
          </div>
        </div>


      </div>

      {/* Content Section */}
      <div className="relative z-20 mt-auto pt-8">
        {/* Pill Badges (Sport & Duration) */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            {sports_type || "HS Basketball"}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            {durationText}
          </span>
        </div>

        {/* Camp Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3 group-hover:text-cyan-300 transition-colors drop-shadow-md line-clamp-2">
          {camp_name || "Great Lakes Basketball Summit"}
        </h3>

        {/* Location & Date Specs */}
        <div className="space-y-1.5 mb-5 text-slate-300 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-slate-400 text-sm shrink-0" />
            <span className="truncate">{campLocation || "Location Not Specified"}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarDays className="text-slate-400 text-sm shrink-0" />
            <span className="truncate">
              {start_date && end_date ? `${start_date} – ${end_date}` : "Sep 6 – Sep 8, 2026"}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Price & Action Button */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight drop-shadow-xs">
            {displayPrice}
          </div>

          <Link
            to={buttonPath}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-white text-white hover:text-slate-900 font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20 group-hover:scale-105 shrink-0"
          >
            <span>{getButtonText()}</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CampCard;