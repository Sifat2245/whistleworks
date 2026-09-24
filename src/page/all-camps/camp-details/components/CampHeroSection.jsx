import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { IoTimeOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import SportIcon from "@/components/shared/SportIcon";
import dummyImage from "@/assets/dummyCardImg.png";
import { formatDate } from "@/utils/campFormat";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function CampHeroSection({
  campName = "Untitled Camp",
  campLogo,
  sportsTypeName = "Sports Camp",
  location = "Location not specified",
  startDate,
  endDate,
  statusMeta,
  durationDays,
  onRegisterClick,
}) {
  return (
    <section className="relative bg-linear-to-br from-[#0b1220] via-[#16213b] to-[#0a0f1c] overflow-hidden">
      {/* Blurred camp logo as ambient background */}
      {campLogo && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={campLogo}
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
              {campName}
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
                src={campLogo || dummyImage}
                alt={`${campName} logo`}
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
              <SportIcon sport={sportsTypeName} className="w-3.5 h-3.5" />
              {sportsTypeName}
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
            {campName}
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
              {formatDate(startDate)}
              {endDate && ` – ${formatDate(endDate)}`}
            </span>
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={onRegisterClick}
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
  );
}
