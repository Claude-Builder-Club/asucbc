"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heading, Text, Button } from "./ui";

type JoinCardProps = {
  title?: string;
  subtitle?: string;
  discordHref?: string;
  benefitsHref?: string;
  className?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
    },
  },
};

export default function JoinCard({
  title = "Join the Claude Builder Club!",
  subtitle = "Meet fellow builders, learn fast, and collaborate on real projects across campus.",
  discordHref = "#",
  benefitsHref = "#",
  className = "",
}: JoinCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-full rounded-xl relative overflow-hidden border-2 border-[var(--theme-card-border)] p-4 sm:p-5 lg:p-6 ${className}`}
      style={{
        background: `
          linear-gradient(135deg,
            var(--theme-card-bg) 0%,
            var(--theme-card-gradient-end, var(--theme-card-bg)) 100%
          )
        `,
        boxShadow:
          "2px 2px 4px rgba(0, 0, 0, 0.05), 4px 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Subtle animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%,
              var(--theme-gradient-accent, transparent) 0%,
              transparent 50%
            )
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />

      {/* Subtle highlight on lit edge */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
        style={{
          background: `
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 40%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div variants={itemVariants}>
          <Heading level="h4" animate={false} className="mb-3">
            {title}
          </Heading>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Text size="base" variant="secondary" className="mb-4">
            {subtitle}
          </Text>
        </motion.div>
        <motion.ul
          variants={itemVariants}
          className="list-disc pl-4 text-sm sm:text-base text-[var(--theme-text-primary)]/80 space-y-1 mb-4"
        >
          <motion.li variants={listItemVariants}>
            Six free months of Claude Pro and $25 in API credits
          </motion.li>
          <motion.li variants={listItemVariants}>
            Hands-on workshops and resources
          </motion.li>
          <motion.li variants={listItemVariants}>
            Exclusive merchandise
          </motion.li>
        </motion.ul>
        <motion.div variants={itemVariants}>
          <Text size="sm" variant="secondary" className="italic mb-4">
            **Benefits require attendance at a CBC event for activation**
          </Text>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href={discordHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
            data-umami-event="Join Discord"
            data-umami-event-location="JoinCard"
          >
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="whitespace-nowrap"
            >
              Join our Discord
            </Button>
          </Link>
          <Link
            href={benefitsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
            data-umami-event="Sign Up Benefits"
            data-umami-event-location="JoinCard"
          >
            <Button variant="secondary" size="md" fullWidth className="h-full">
              Sign up to receive benefits
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
