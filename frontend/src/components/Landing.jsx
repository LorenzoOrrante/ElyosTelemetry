import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const Landing = ({ onFinish }) => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        scale: 20,
        opacity: 0,
        transition: { duration: 2.5, ease: "easeInOut" },
      });
      onFinish(); // This calls that the animation have finished
    };
    sequence();
  }, [controls, onFinish]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <motion.h1
        animate={controls}
        initial={{ scale: 1, opacity: 1 }}
        className="text-white text-[10vw] font-extrabold tracking-widest"
      >
        ELYOS
      </motion.h1>
    </div>
  );
};

export default Landing;
