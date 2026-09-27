import { motion } from "framer-motion";
import {
  FaCalendarDays,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaShieldHalved,
  FaMobileScreenButton,
  FaLocationDot,
  FaBell,
  FaLayerGroup,
} from "react-icons/fa6";
import CommonTitle from "../../../components/common/CommonTitle";

const DEFAULT_FEATURES = [
  {
    id: 1,
    title: "Smart Court Scheduling",
    description: "Automate referee court allocations with conflict detection, rest time monitoring, and instant slot swaps.",
    badge: "For Directors"
  },
  {
    id: 2,
    title: "Instant Digital Scorecards",
    description: "Evaluators record real-time mechanics, positioning ratings, and constructive audio/text notes on-court.",
    badge: "For Evaluators"
  },
  {
    id: 3,
    title: "Automated Referee Payroll",
    description: "Track per-game rates, mileage reimbursements, and payouts with built-in financial audit reporting.",
    badge: "Financials"
  },
  {
    id: 4,
    title: "Live Ranking Leaderboards",
    description: "Generate instant official camp rankings and downloadable PDF reports for conference assignments.",
    badge: "Analytics"
  },
  {
    id: 5,
    title: "Multi-Sport Officiating",
    description: "Customizable position templates for Basketball (2/3-person), Football, Soccer, Volleyball, and Baseball.",
    badge: "Multi-Sport"
  },
  {
    id: 6,
    title: "Mobile Dashboard Access",
    description: "Referees and directors get real-time schedule updates, court notifications, and evaluation reports anywhere.",
    badge: "Mobile App"
  },
];

const getFeatureIcon = (feature, idx) => {
  if (feature?.icon) return feature.icon;

  const title = (feature?.title || "").toLowerCase();
  const desc = (feature?.description || "").toLowerCase();
  const combined = `${title} ${desc}`;

  if (combined.includes("evaluat") || combined.includes("scorecard") || combined.includes("review")) {
    return <FaClipboardCheck className="text-white text-xl" />;
  }
  if (combined.includes("payment") || combined.includes("registration") || combined.includes("stripe") || combined.includes("payroll") || combined.includes("money") || combined.includes("fee")) {
    return <FaMoneyBillWave className="text-white text-xl" />;
  }
  if (combined.includes("gps") || combined.includes("location") || combined.includes("navigation") || combined.includes("map")) {
    return <FaLocationDot className="text-white text-xl" />;
  }
  if (combined.includes("communication") || combined.includes("notification") || combined.includes("message") || combined.includes("chat") || combined.includes("alert")) {
    return <FaBell className="text-white text-xl" />;
  }
  if (combined.includes("schedul") || combined.includes("calendar") || combined.includes("court") || combined.includes("game")) {
    return <FaCalendarDays className="text-white text-xl" />;
  }
  if (combined.includes("multi-camp") || combined.includes("management") || combined.includes("dashboard") || combined.includes("camp")) {
    return <FaLayerGroup className="text-white text-xl" />;
  }
  if (combined.includes("ranking") || combined.includes("leaderboard") || combined.includes("analytic") || combined.includes("report")) {
    return <FaChartLine className="text-white text-xl" />;
  }
  if (combined.includes("mobile") || combined.includes("app") || combined.includes("phone")) {
    return <FaMobileScreenButton className="text-white text-xl" />;
  }

  const defaultIcons = [
    <FaClipboardCheck key="1" className="text-white text-xl" />,
    <FaMoneyBillWave key="2" className="text-white text-xl" />,
    <FaLocationDot key="3" className="text-white text-xl" />,
    <FaBell key="4" className="text-white text-xl" />,
    <FaCalendarDays key="5" className="text-white text-xl" />,
    <FaLayerGroup key="6" className="text-white text-xl" />,
  ];

  return defaultIcons[idx % defaultIcons.length] || <FaShieldHalved className="text-white text-xl" />;
};

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
                    {getFeatureIcon(feature, idx)}
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
