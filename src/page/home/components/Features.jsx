import { motion } from "framer-motion";
import {
  FaCalendarDays,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaShieldHalved,
  FaMobileScreenButton,
  FaCheck
} from "react-icons/fa6";
import CommonTitle from "../../../components/common/CommonTitle";

const DEFAULT_FEATURES = [
  {
    id: 1,
    title: "Smart Court Scheduling",
    description: "Automate referee court allocations with conflict detection, rest time monitoring, and instant slot swaps.",
    icon: <FaCalendarDays className="text-white text-xl" />,
    badge: "For Directors"
  },
  {
    id: 2,
    title: "Instant Digital Scorecards",
    description: "Evaluators record real-time mechanics, positioning ratings, and constructive audio/text notes on-court.",
    icon: <FaClipboardCheck className="text-white text-xl" />,
    badge: "For Evaluators"
  },
  {
    id: 3,
    title: "Automated Referee Payroll",
    description: "Track per-game rates, mileage reimbursements, and payouts with built-in financial audit reporting.",
    icon: <FaMoneyBillWave className="text-white text-xl" />,
    badge: "Financials"
  },
  {
    id: 4,
    title: "Live Ranking Leaderboards",
    description: "Generate instant official camp rankings and downloadable PDF reports for conference assignments.",
    icon: <FaChartLine className="text-white text-xl" />,
    badge: "Analytics"
  },
  {
    id: 5,
    title: "Multi-Sport Officiating",
    description: "Customizable position templates for Basketball (2/3-person), Football, Soccer, Volleyball, and Baseball.",
    icon: <FaShieldHalved className="text-white text-xl" />,
    badge: "Multi-Sport"
  },
  {
    id: 6,
    title: "Mobile Dashboard Access",
    description: "Referees and directors get real-time schedule updates, court notifications, and evaluation reports anywhere.",
    icon: <FaMobileScreenButton className="text-white text-xl" />,
    badge: "Mobile App"
  },
];

const Features = ({ mainFeature, featureItems = [] }) => {
  const title = mainFeature?.title || "Built for Modern Officiating Operations";
  const description =
    mainFeature?.description ||
    "Whistle Works unites camp directors, evaluators, and sports officials in one streamlined cloud platform.";

  const displayedFeatures = featureItems.length > 0 ? featureItems : DEFAULT_FEATURES;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">

          <CommonTitle
            text={title}
            className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          />

          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#00AEEF] text-white flex items-center justify-center border border-[#00AEEF] shadow-md shadow-[#00AEEF]/25 transition-transform group-hover:scale-105 duration-300">
                    {feature.icon ? (
                      <span className="text-white text-xl">{feature.icon}</span>
                    ) : feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-6 w-6 object-contain filter brightness-0 invert"
                      />
                    ) : (
                      <FaShieldHalved className="text-white text-xl" />
                    )}
                  </div>

                  {feature.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {feature.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2.5">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
