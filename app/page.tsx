"use client";

import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CalendarContainer from "./components/calendar/CalendarContainer";
import JoinCard from "./components/JoinCard";
import HackathonPromo from "./components/HackathonPromo";
import { showHackathonPromo } from "./theme-config";
import { Heading, Text } from "./components/ui";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const leftColumnVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
      delay: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
    },
  },
};

export default function Home() {
  return (
    <div className="max-h-full flex flex-col ">
      <Header />

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="font-sans flex-1 pt-4 px-4 pb-0 sm:pt-8 sm:px-8 md:p-20 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start max-w-7xl mx-auto">
          {/* Left half - Title + Hackathon + Join Card */}
          <motion.div
            variants={leftColumnVariants}
            className="flex flex-col justify-start items-center lg:items-start gap-6 text-center lg:text-left w-full max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="space-y-3 sm:space-y-4 lg:space-y-3 w-full lg:mb-13"
            >
              <Heading
                level="h1"
                animate={false}
                className="leading-tight text-balance lg:text-5xl xl:text-[3.25rem] 2xl:text-[3.5rem]"
              >
                The Arizona State University Claude Builder Club
              </Heading>
              <Heading
                level="h3"
                className="leading-relaxed text-balance lg:text-2xl xl:text-2xl"
              >
                Where curiosity meets{" "}
                <span className="text-[var(--theme-text-accent)] font-bold underline">
                  cutting-edge AI
                </span>
                . Build{" "}
                <span className="text-[var(--theme-text-accent)] font-bold underline">
                  anything
                </span>
                . Create the{" "}
                <span className="text-[var(--theme-text-accent)] font-bold underline italic">
                  impossible
                </span>
                .
              </Heading>
            </motion.div>

            {/* Join Card moved here */}
            <motion.div variants={itemVariants} className="w-full">
              <JoinCard
                discordHref="https://discord.gg/PRh8F2XebB"
                benefitsHref="/login"
              />
            </motion.div>

            {/* Hackathon promo */}
            {showHackathonPromo && (
              <motion.div variants={itemVariants}>
                <HackathonPromo className="mt-2" />
              </motion.div>
            )}
          </motion.div>

          {/* Right half - Calendar only */}
          <motion.div
            variants={rightColumnVariants}
            className="flex flex-col items-center lg:items-start w-full max-w-2xl"
          >
            <motion.div variants={itemVariants} className="w-full">
              <CalendarContainer className="w-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
