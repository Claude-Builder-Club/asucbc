"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ClaudeRedeemForm from "../components/ClaudeRedeemForm";
import { Heading, Text, Badge, Card } from "../components/ui";
import { motion } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
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

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      mass: 0.5,
      delay: 0.1,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
      delay: 0.2,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
      delay: 0.3,
    },
  },
};

export default function RedeemPage() {
  return (
    <div className="max-h-full flex flex-col">
      <Header />
      <div className="font-sans flex-1 pt-4 px-4 pb-0 sm:pt-8 sm:px-8 md:p-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              <Heading level="h1" animate={false} className="leading-tight mb-2">
                Free <span className="text-[var(--theme-text-accent)] font-bold">Claude Pro + API Credits</span>
              </Heading>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
              className="inline-block mb-4 cursor-default"
            >
              <Badge variant="primary" size="lg">EXCLUSIVE SEMESTER OFFER</Badge>
            </motion.div>
            <motion.div
              variants={descriptionVariants}
              initial="hidden"
              animate="visible"
            >
              <Text size="xl" variant="secondary" className="max-w-2xl mx-auto leading-relaxed">
                Get free Claude Pro for the semester + API credits. Location verification required.
              </Text>
            </motion.div>
          </div>

          {/* Redemption Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <Card gradient animated={false} className="shadow-xl">
              <ClaudeRedeemForm />
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
