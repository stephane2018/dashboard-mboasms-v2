import { motion } from "framer-motion";
import logo from "@/assets/images/logo-full.png";

export const SplashScreen = () => {
  return (
    <div>
      <motion.div
        className="flex h-screen items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-6 px-8">
          {/* <div className="w-fit text-xl text-brand font-medium font-asterone">
            <span className="font-proxima-nova-sc text-4xl font-medium">Q</span>uastrom-Renov
          </div> */}

          <img src={logo} alt="Quastrom-Connect" className="w-56" />

          <div className="relative h-2.5 w-full overflow-hidden rounded-lg bg-accent md:max-w-xl xl:max-w-md">
            <div className="duration-[1500ms] absolute inset-0 h-full w-full animate-splash-progress rounded-lg bg-primary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
