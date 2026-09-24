import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function CampBottomCta({
  campName = "this camp",
  directorName = "our director",
  sportsTypeName = "Sports",
  onRegisterClick,
}) {
  return (
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
            Join {campName} and train with {directorName} — spots fill up fast for {sportsTypeName} camps.
          </p>
          <button
            type="button"
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-base px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Register Now
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
