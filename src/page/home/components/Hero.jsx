import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonSubmitBtn from "../../../components/common/CommonSubmitBtn";
import { useAuth } from "@/hooks/useAuth";

import img1 from "@/assets/banner-images/photo-1634306320577-eb8f44e6ab96.webp";
import img2 from "@/assets/banner-images/photo-1696507625579-17b76b10d185.webp";
import img3 from "@/assets/banner-images/photo-1734495444942-d96710ba652b.webp";
import img4 from "@/assets/banner-images/photo-1757588102227-1087924bc438.webp";
import img5 from "@/assets/banner-images/photo-1770230511907-c43e39266af3.webp";
import img6 from "@/assets/banner-images/photo-1777997856522-e69683eb7017.webp";

const bannerImages = [img1, img2, img3, img4, img5, img6];

const Hero = ({ heroData }) => {
  const { userData } = useAuth();
  const userRole = userData?.role;
  const [currentIndex, setCurrentIndex] = useState(0);

  const dashboardPath =
    {
      director: "/director-dashboard",
      evaluator: "/evaluator-dashboard",
      referee: "/referee-dashboard",
    }[userRole] || "/";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Animated Banner Images Slideshow */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bannerImages[currentIndex]})` }}
          />
        </AnimatePresence>

        {/* Multi-layered Dark Overlay for optimal contrast and visual excellence */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/85 z-10" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 container text-white py-8 flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-snug sm:leading-tight md:leading-tight lg:leading-tight mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl drop-shadow-lg"
          variants={itemVariants}
        >
          {heroData?.title || "Referee Camp Management Made Simple"}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-gray-200 px-2 sm:px-0 drop-shadow-md font-normal"
          variants={itemVariants}
        >
          {heroData?.description ||
            "Our comprehensive camp management system is built specifically for camp directors, referees, and evaluators who want less admin work and better on-court/field results."}
        </motion.p>

        <motion.div
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center items-center w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto"
          variants={itemVariants}
        >
          {userData ? (
            <CommonSubmitBtn
              link={true}
              path={dashboardPath}
              variant="secondary"
              className="w-full xs:w-auto min-w-40 sm:min-w-[180px] text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all"
            >
              Dashboard
            </CommonSubmitBtn>
          ) : (
            <CommonSubmitBtn
              variant="secondary"
              link={true}
              path="/auth/signin"
              className="w-full xs:w-auto min-w-40 sm:min-w-[180px] text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all"
            >
              Login
            </CommonSubmitBtn>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
