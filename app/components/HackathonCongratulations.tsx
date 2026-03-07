"use client";

import { motion } from "framer-motion";
import { Heading, Text, Button } from "./ui";
import Link from "next/link";

type HackathonCongratulationsProps = {
  onReset?: () => void;
  hackathonName?: string;
  eventDates?: string;
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const confettiVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 1, 0],
    scale: [0, 1.2, 1, 0.8],
    y: [0, -100, -200, -300],
    x: [0, Math.random() * 100 - 50, Math.random() * 150 - 75, Math.random() * 200 - 100],
    rotate: [0, Math.random() * 360, Math.random() * 720, Math.random() * 1080],
    transition: {
      duration: 2,
      delay: i * 0.05,
      ease: "easeOut" as const,
    },
  }),
};

export default function HackathonCongratulations({
  onReset,
  hackathonName = "HackASU 2026",
  eventDates = "March 20-22, 2026",
}: HackathonCongratulationsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative py-12 px-6 text-center overflow-hidden"
    >
      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: "50%",
              width: "12px",
              height: "12px",
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            }}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div variants={itemVariants} className="mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-4"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Congratulations Message */}
      <motion.div variants={itemVariants}>
        <Heading level="h2" animate={false} className="mb-4">
          🎉 Congratulations! 🎉
        </Heading>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Text size="xl" variant="primary" className="mb-6 font-semibold">
          You're registered for the {hackathonName}!
        </Text>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Text size="base" variant="secondary" className="mb-8 max-w-xl mx-auto">
          We've received your registration and will review it shortly.
          You should receive a confirmation email within 1-7 business days with more details about the event.
        </Text>
      </motion.div>

      {/* What's Next Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-2xl p-6 max-w-2xl mx-auto">
          <Heading level="h4" animate={false} className="mb-4">
            📋 What's Next?
          </Heading>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-[var(--theme-text-accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--theme-text-accent)] text-sm font-bold">1</span>
              </div>
              <Text size="base" variant="primary">
                <strong>Check your email</strong> for confirmation (within 1-7 business days)
              </Text>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-[var(--theme-text-accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--theme-text-accent)] text-sm font-bold">2</span>
              </div>
              <Text size="base" variant="primary">
                <strong>Join our Discord</strong> to connect with other participants
              </Text>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-[var(--theme-text-accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--theme-text-accent)] text-sm font-bold">3</span>
              </div>
              <Text size="base" variant="primary">
                <strong>Mark your calendar</strong> for {eventDates}
              </Text>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="https://discord.gg/PRh8F2XebB"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="Congratulations - Discord Join"
        >
          <Button variant="primary" size="lg" fullWidth>
            Join Discord Community
          </Button>
        </Link>
        <Link href="/" data-umami-event="Congratulations - Back Home">
          <Button variant="secondary" size="lg" fullWidth>
            Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* Optional: Register Another Person */}
      {onReset && (
        <motion.div variants={itemVariants} className="mt-8">
          <button
            onClick={onReset}
            className="text-[var(--theme-text-accent)] hover:underline text-sm font-medium"
            data-umami-event="Congratulations - Register Another"
          >
            Register another person
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
