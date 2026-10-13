import { motion } from "framer-motion";

const StatsBar = () => {
  const stats = [
    { label: "Camps Managed", value: "30+", highlight: true },
    { label: "Officials Evaluated", value: "1,000+", highlight: false },
    { label: "On-Court Accuracy", value: "99.9%", highlight: true },
    { label: "Coordinator Rating", value: "4.9 / 5", highlight: false },
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800/80 py-8 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-center shadow-xl">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="px-2"
            >
              <div
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${item.highlight ? "text-[#00AEEF]" : "text-white"
                  }`}
              >
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
