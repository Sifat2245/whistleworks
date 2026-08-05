import BackBtn from "@/components/common/BackBtn";
import { FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

const DirectorPreviousCamps = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <BackBtn />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-2xl border border-[#E8E8E8] bg-white p-8 sm:p-12 text-center shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <FiClock className="size-8 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Previous Camps
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
            Your completed camps will appear here with full history — schedules,
            rosters, evaluations, and rankings.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-4 py-2 text-xs font-medium text-gray-500">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            This section is coming soon
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectorPreviousCamps;
