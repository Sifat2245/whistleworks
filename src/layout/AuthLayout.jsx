import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import authLogo from "@/assets/logo4x.png";
import { FaArrowLeft } from "react-icons/fa6";

const AuthLayout = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <motion.div
        className="w-1/2 flex flex-col items-center justify-center bg-neutral-100 px-10 relative"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="text-primary flex gap-2 items-center font-medium"
          >
            <FaArrowLeft />
            <span>Back to home</span>
          </Link>
        </div>
        <motion.img
          src={authLogo}
          alt="Logo"
          className="w-60 h-44 object-contain mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />

        <motion.h1
          className="text-4xl font-semibold text-neutral-700 text-center w-4/5 mb-4 leading-snug"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Professional <span className="text-primary">Referee Camp</span>{" "}
          Management Made Simple
        </motion.h1>

        <motion.p
          className="text-base text-neutral-600 text-center w-3/4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Streamline scheduling, evaluations, and camp management with our
          comprehensive platform designed for sports professionals.
        </motion.p>
      </motion.div>

      {/* Right Side (Static) */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
