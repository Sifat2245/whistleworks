import { motion } from "framer-motion";
import { IoTrophyOutline } from "react-icons/io5";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function CampAboutSection({ campDetails }) {
  return (
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
          __html: campDetails || "<p>No description available.</p>",
        }}
      />
    </motion.section>
  );
}
