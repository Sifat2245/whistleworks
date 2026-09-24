import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";
import SportIcon from "@/components/shared/SportIcon";
import { formatDate } from "@/utils/campFormat";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function CampStatsGrid({
  startDate,
  endDate,
  sportsTypeName = "Sports Camp",
  location = "Location not specified",
  price,
}) {
  const stats = [
    {
      icon: <FiCalendar className="w-5 h-5" />,
      tint: "bg-primary/10 text-primary",
      label: "Camp Dates",
      value: `${formatDate(startDate)} – ${formatDate(endDate)}`,
    },
    {
      icon: <SportIcon sport={sportsTypeName} className="w-5 h-5" />,
      tint: "bg-violet-50 text-violet-600",
      label: "Sport",
      value: sportsTypeName,
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
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        {stats.map(({ icon, tint, label, value }) => (
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
  );
}
