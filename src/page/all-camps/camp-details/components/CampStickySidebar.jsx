import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiCheck } from "react-icons/fi";
import { IoTimeOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import SportIcon from "@/components/shared/SportIcon";
import { formatDate } from "@/utils/campFormat";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function CampStickySidebar({
  price,
  statusMeta,
  countdown,
  startDate,
  endDate,
  sportsTypeName = "Sports Camp",
  location = "Location not specified",
  durationDays,
  onRegisterClick,
}) {
  return (
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
                {formatDate(startDate)} – {formatDate(endDate)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <SportIcon sport={sportsTypeName} className="w-4 h-4 text-primary shrink-0" />
              <span className="text-gray-600 capitalize">
                {sportsTypeName}
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
            onClick={onRegisterClick}
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
  );
}
