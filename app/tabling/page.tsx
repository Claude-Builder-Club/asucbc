'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Sparkles, Award, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heading, Text, Card } from '../components/ui';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
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
      stiffness: 100,
      damping: 15,
    },
  },
};

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(204, 120, 92, 0.3)',
      '0 0 40px rgba(204, 120, 92, 0.5)',
      '0 0 20px rgba(204, 120, 92, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

interface TablerProfile {
  name: string;
  position: string;
  website: string;
  image: string;
  description: string;
  incomingRole?: string;
  company?: string;
  companyColor?: string;
}

const tablers: TablerProfile[] = [
  {
    name: "John Li",
    position: "Technology Officer",
    website: "https://tet.moe",
    image: "/staff/john.png",
    description: "Full Stack Developer",
    incomingRole: "Software Engineer",
    company: "Tesla",
    companyColor: "#C97A7E", // Muted Tesla Red
  },
  {
    name: "Shiven Shekar",
    position: "President",
    website: "https://shivenshekar.com",
    image: "/staff/shiven.png",
    description: "AppliedML & Distributed Systems",
    incomingRole: "Software Engineer",
    company: "Apple",
    companyColor: "#8B8B8B", // Muted Apple Gray
  },
];

export default function TablingPage() {
  return (
    <div className="min-h-[100dvh] max-h-[100dvh] relative overflow-y-auto">
      <Header />
      <div className="font-sans p-8 pb-20 sm:p-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.div variants={badgeVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-card-bg)] border-2 border-[var(--theme-card-border)] rounded-full">
                <Users className="w-4 h-4 text-[var(--theme-text-accent)]" />
                <Text size="sm" className="font-semibold text-[var(--theme-text-accent)]">
                  Today's Tablers
                </Text>
              </div>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Heading level="h1" animate={false} className="mb-4">
                Meet Our Team
              </Heading>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
                Scan the QR codes below to visit our tablers' portfolios and learn more about their work
              </Text>
            </motion.div>
          </div>

          {/* Tablers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 mt-8">
            {tablers.map((tabler, index) => (
              <motion.div
                key={tabler.name}
                variants={cardVariants}
                custom={index}
              >
                <Card hoverable gradient animated={false} className="h-full relative overflow-visible">
                  {/* Incoming Role Badge - Prominently Displayed at Top */}
                  {/* <motion.div
                    variants={glowVariants}
                    animate="animate"
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20  overflow-visible"
                  >
                    <div
                      className="px-6 py-3 rounded-full shadow-2xl border-4 border-white dark:border-slate-900"
                      style={{
                        background: `linear-gradient(135deg, ${tabler.companyColor}cc 0%, ${tabler.companyColor}99 100%)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-white animate-pulse" />
                        <Text size="sm" className="font-black text-white tracking-wide uppercase">
                          Incoming {tabler.company} SWE
                        </Text>
                        <Zap className="w-5 h-5 text-white animate-pulse" />
                      </div>
                    </div>
                  </motion.div> */}

                  <div className="flex flex-col items-center text-center space-y-6 pt-8">
                    {/* Profile Image */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-full border-4 border-[var(--theme-card-border)] shadow-lg overflow-hidden relative">
                        <Image
                          src={tabler.image}
                          alt={tabler.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                        {/* Bottom fade gradient */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                      </div>
                      {tabler.companyColor && (
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            backgroundColor: tabler.companyColor,
                          }}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      {!tabler.companyColor && (
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--theme-text-accent)] rounded-full flex items-center justify-center shadow-lg"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Profile Info */}
                    <div className="space-y-3">
                      <Heading level="h2" animate={false}>
                        {tabler.name}
                      </Heading>

                      {/* Company Role Highlight */}
                      {tabler.incomingRole && tabler.company && tabler.companyColor && (
                        <div className="space-y-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-block px-4 py-2 rounded-lg border-2"
                            style={{
                              borderColor: tabler.companyColor,
                              background: `${tabler.companyColor}15`,
                            }}
                          >
                            <Text size="base" className="font-bold" style={{ color: tabler.companyColor }}>
                              Incoming {tabler.incomingRole} @ {tabler.company}
                            </Text>
                          </motion.div>
                        </div>
                      )}

                      <Text size="lg" className="text-[var(--theme-text-accent)] font-semibold">
                        {tabler.position}
                      </Text>
                      <Text size="lg" variant="secondary">
                        {tabler.description}
                      </Text>
                    </div>

                    {/* QR Code */}
                    <motion.div
                      whileHover={{ scale: 1.02, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full"
                    >
                      <div className="bg-white p-6 rounded-xl shadow-inner inline-block">
                        <QRCodeSVG
                          value={tabler.website}
                          size={200}
                          level="H"
                          includeMargin={false}
                          fgColor="#1a1a1a"
                          bgColor="transparent"
                        />
                      </div>
                    </motion.div>

                    {/* Website Link */}
                    <motion.a
                      href={tabler.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full"
                    >
                      <div className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] rounded-lg hover:bg-[var(--theme-button-hover-bg)] transition-colors shadow-lg">
                        <ExternalLink className="w-5 h-5" />
                        <Text size="sm" className="font-semibold text-white">
                          Visit Portfolio
                        </Text>
                      </div>
                    </motion.a>

                    {/* Website URL Display */}
                    <Text size="xs" variant="secondary" className="break-all">
                      {tabler.website}
                    </Text>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            variants={cardVariants}
            className="mb-16"
          >
            <Card gradient animated={false} className="max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <Heading level="h3" animate={false}>
                  About Claude Builder Club
                </Heading>
                <Text variant="secondary">
                  The Arizona State University Claude Builder Club is dedicated to exploring the
                  cutting-edge capabilities of Anthropic's Claude AI. We foster innovation, collaboration,
                  and learning in the rapidly evolving field of artificial intelligence.
                </Text>
                <div className="pt-4">
                  <a
                    href="https://claudebuilder.club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--theme-button-alternate-bg)] text-[var(--theme-button-alternate-text)] rounded-lg hover:bg-[var(--theme-button-alternate-hover-bg)] transition-colors shadow-lg font-semibold"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit Our Website
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.8 }}
            className="pt-8"
          >
            <Footer />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
