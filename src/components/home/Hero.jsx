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
      className="relative bg-cover bg-center bg-no-repeat min-h-[85vh] flex items-center"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >

      {/* Content */}
      <motion.div
        className="relative z-10 container  text-white py-20 flex flex-col justify-center space-y-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-6xl mx-auto"
          variants={itemVariants}
        >
          Professional <span className="text-primary">Referee Camp</span> Management Made Simple
        </motion.h1>

        <motion.p
          className="text-lg sm:text-2xl max-w-5xl mx-auto text-gray-100"
          variants={itemVariants}
        >
          Streamline scheduling, evaluations, and camp management with our
          comprehensive platform designed for sports professionals.
        </motion.p>

        <motion.div
          className="flex gap-4 pt-4 justify-center items-center flex-wrap"
          variants={itemVariants}
        >
          <CommonSubmitBtn variant="primary" className="sm:w-auto w-full">
            Start Free Trial
          </CommonSubmitBtn>

          <CommonSubmitBtn variant="secondary" className="sm:w-auto w-full">
            Login
          </CommonSubmitBtn>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
