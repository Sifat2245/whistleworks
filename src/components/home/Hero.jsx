import heroBg from "@/assets/hero-bg.png";
import CommonSubmitBtn from "../common/CommonSubmitBtn";
import { motion } from "framer-motion";

const Hero = () => {
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
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] sm:min-h-[90vh] flex items-center"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      {/* Optional Overlay for better text readability on mobile */}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/10 lg:from-black/20 lg:via-black/10 lg:to-transparent z-0" />

      {/* Content */}
      <motion.div
        className="relative z-10 container px-4 sm:px-6 lg:px-8 text-white sm:py-10 lg:py-20 flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight md:leading-tight lg:leading-tight mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl"
          variants={itemVariants}
        >
          Professional{" "}
          <span className="text-primary inline-block mt-1 sm:mt-0">
            Referee Camp
          </span>{" "}
          Management Made Simple
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-gray-100 px-2 sm:px-0"
          variants={itemVariants}
        >
          Streamline scheduling, evaluations, and camp management with our
          comprehensive platform designed for sports professionals.
        </motion.p>

        <motion.div
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 justify-center items-center w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto"
          variants={itemVariants}
        >
          <CommonSubmitBtn
            variant="primary"
            className="w-full xs:w-auto min-w-40 sm:min-w-[180px] text-sm sm:text-base"
          >
            Start Free Trial
          </CommonSubmitBtn>

          <CommonSubmitBtn
            variant="secondary"
            className="w-full xs:w-auto min-w-40 sm:min-w-[180px] text-sm sm:text-base"
          >
            Login
          </CommonSubmitBtn>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;