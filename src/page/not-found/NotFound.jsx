import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/common/Logo";
import {
  HiHome,
  HiArrowLeft,
  HiShieldExclamation,
  HiCalendar,
  HiSparkles,
  HiQuestionMarkCircle,
  HiSquares2X2,
} from "react-icons/hi2";
import { BiCompass } from "react-icons/bi";
import { GiWhistle } from "react-icons/gi";

const NotFound = () => {
  const navigate = useNavigate();
  const [isBlowingWhistle, setIsBlowingWhistle] = useState(false);

  const handleBlowWhistle = () => {
    setIsBlowingWhistle(true);
    setTimeout(() => setIsBlowingWhistle(false), 1200);
  };

  const quickLinks = [
    {
      title: "Find Camps",
      desc: "Browse all upcoming basketball & sports camps",
      icon: <HiCalendar className="w-5 h-5 text-[#00AEEF]" />,
      path: "/all-camps",
    },
    {
      title: "Director Dashboard",
      desc: "Manage camps, court schedules & referees",
      icon: <HiSquares2X2 className="w-5 h-5 text-indigo-400" />,
      path: "/director-dashboard",
    },
    {
      title: "What's New",
      desc: "Check out the latest features and updates",
      icon: <HiSparkles className="w-5 h-5 text-amber-400" />,
      path: "/whats-new",
    },
    {
      title: "Help & FAQ",
      desc: "Get answers to common questions",
      icon: <HiQuestionMarkCircle className="w-5 h-5 text-emerald-400" />,
      path: "/faq",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#00AEEF]/30 selection:text-[#00AEEF]">
      {/* Background Ambient Glows & Court Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Cyan Glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#00AEEF]/15 blur-[120px]" />
        {/* Bottom Left Indigo Glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px]" />

        {/* Tactical Sports Court Grid Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="court-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#court-grid)" />
        </svg>

        {/* Center Court Circle Line Decorative Accent */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.03] rounded-full pointer-events-none flex items-center justify-center">
          <div className="w-[450px] h-[450px] border border-white/[0.03] rounded-full" />
        </div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo className="h-8 w-auto text-white" />
        </Link>

      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Whistle & 404 Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-6"
        >
          {/* Glowing 404 Background Text */}
          <h1 className="text-[120px] sm:text-[180px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 via-white/5 to-transparent select-none leading-none">
            404
          </h1>

          {/* Floating Central Icon Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={
                isBlowingWhistle
                  ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.25, 1] }
                  : { y: [0, -8, 0] }
              }
              transition={
                isBlowingWhistle
                  ? { duration: 0.5 }
                  : { repeat: Infinity, duration: 4, ease: "easeInOut" }
              }
              onClick={handleBlowWhistle}
              title="Click to blow whistle!"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#00AEEF] to-indigo-600 p-0.5 shadow-[0_0_40px_rgba(0,174,239,0.4)] cursor-pointer group"
            >
              <div className="w-full h-full rounded-[22px] bg-[#0F172A] flex flex-col items-center justify-center relative overflow-hidden">
                <GiWhistle className="text-4xl sm:text-5xl text-[#00AEEF] group-hover:scale-110 transition-transform" />
                {isBlowingWhistle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#00AEEF]/20 rounded-full animate-ping pointer-events-none"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HiShieldExclamation className="w-4 h-4" />
            <span>Out of Bounds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Whoops! This Play Was Called Back.
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            The page or route you are looking for doesn't exist, has been moved,
            or was whistled out of bounds by the ref.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00AEEF] text-white font-semibold shadow-lg shadow-[#00AEEF]/25 hover:bg-[#0096ce] hover:shadow-[#00AEEF]/40 active:scale-95 transition-all cursor-pointer"
          >
            <HiHome className="w-5 h-5" />
            <span>Return to Home</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold border border-white/10 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <Link
            to="/all-camps"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 text-gray-300 font-semibold border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <BiCompass className="w-5 h-5 text-[#00AEEF]" />
            <span>Explore Camps</span>
          </Link>
        </motion.div>

        {/* Quick Destinations Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 w-full text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 text-center">
            Or Jump Straight To Popular Pages
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#00AEEF]/50 hover:bg-white/[0.06] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-[#00AEEF] transition-colors">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-[#00AEEF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-gray-500 border-t border-white/[0.06]">
        <p>© {new Date().getFullYear()} Whistle Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;
