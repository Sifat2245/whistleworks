import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import authLogo from "@/assets/logo4x.png";
import bgImage from "@/assets/banner-images/photo-1634306320577-eb8f44e6ab96.webp";
import { FaArrowLeft } from "react-icons/fa6";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-950 py-4 px-4">
      {/* Background Image with Dark Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105 bg-slate-950"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70 backdrop-blur-xs" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between py-1 px-2 sm:px-4">
        <Link
          to="/"
          className="text-white/90 hover:text-primary flex gap-2 items-center font-medium text-xs sm:text-sm transition-colors bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg hover:border-primary/40"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to home</span>
        </Link>

        <Link to="/" className="flex items-center gap-2">
          <img
            src={authLogo}
            alt="Whistle Works Logo"
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-md"
          />
        </Link>
      </div>

      {/* Centered Auth Card Form Container */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-2">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg lg:max-w-xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/60 p-5 sm:p-7 lg:p-8"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer / Copyright */}
      <div className="relative z-10 text-center text-[11px] text-gray-400 py-1">
        © {new Date().getFullYear()} Whistle Works. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;