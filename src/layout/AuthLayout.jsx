import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import authLogo from "@/assets/logo4x.png";
import { FaArrowLeft } from "react-icons/fa6";
import { useState, useEffect } from "react";

const AuthLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Note: main ui 
  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen overflow-auto lg:overflow-hidden">
      {/* Left Side - Hero Section */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-neutral-100 px-4 md:px-6 lg:px-10 py-8 lg:py-0 relative min-h-[40vh] lg:min-h-screen"
        initial={{ opacity: 0, x: isMobile ? 0 : -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <Link
            to="/"
            className="text-primary flex gap-2 items-center font-medium text-sm md:text-base"
          >
            <FaArrowLeft className="text-xs md:text-sm" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <motion.img
            src={authLogo}
            alt="Logo"
            className="w-40 h-32 md:w-52 md:h-40 lg:w-60 lg:h-44 object-contain  lg:mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />

          <motion.h1
            className="text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700 text-center w-full mb-3 md:mb-4 leading-snug"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional{" "}
            <span className="text-primary block md:inline">Referee Camp</span>{" "}
            Management Made Simple
          </motion.h1>

          <motion.p
            className="text-sm md:text-base text-neutral-600 text-center w-full md:w-5/6 lg:w-3/4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Streamline scheduling, evaluations, and camp management with our
            comprehensive platform designed for sports professionals.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 md:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;