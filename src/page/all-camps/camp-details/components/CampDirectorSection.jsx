import { motion } from "framer-motion";
import { FiHome, FiMail, FiPhone } from "react-icons/fi";
import dummyImage from "@/assets/dummyCardImg.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function CampDirectorSection({
  directorName = "Camp Director",
  directorAvatar,
  directorEmail,
  directorPhone,
  directorAddress,
}) {
  return (
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
  );
}
