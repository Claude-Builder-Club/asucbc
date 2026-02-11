"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiHash } from "react-icons/fi";
import { TeamMember, teamMembers } from "../../types/team";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { TeamMemberCard } from "../components/Team/TeamMemberCard";
import { Heading, Text, TiltCard } from "../components/ui";
import { useCopyUrlWithHash } from "../hooks/useCopyUrlWithHash";

interface Contributor {
  name: string;
  url: string;
  image: string;
}

const contributors: Contributor[] = [
  {
    name: "AwesomeJaith",
    url: "https://github.com/AwesomeJaith",
    image: "https://avatars.githubusercontent.com/AwesomeJaith",
  },
  {
    name: "anmol7470",
    url: "https://github.com/anmol7470",
    image: "https://avatars.githubusercontent.com/anmol7470",
  },
  {
    name: "icedTet",
    url: "https://github.com/icedTet",
    image: "https://avatars.githubusercontent.com/icedTet",
  },
  {
    name: "shiven01",
    url: "https://github.com/shiven01",
    image: "https://avatars.githubusercontent.com/shiven01",
  },
  {
    name: "ShoryaRaj",
    url: "https://github.com/X-XENDROME-X",
    image: "https://avatars.githubusercontent.com/X-XENDROME-X",
  },
];

const titleVariants = {
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

const subtitleVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.5,
      delay: 0.1,
    },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export default function TeamPage() {
  const [activeMember, setActiveMember] = useState<TeamMember["id"] | null>(
    null,
  );
  const { copyToClipboard } = useCopyUrlWithHash();

  return (
    <div
      className="min-h-[100dvh] max-h-[100dvh] relative overflow-y-auto"
      onClick={() => setActiveMember(null)}
    >
      <Header />
      <div className="font-sans p-8 pb-20 sm:p-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16 flex flex-col items-center max-w-prose mx-auto">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <Heading level="h1" animate={false} className="mb-4">
                Meet Our Team
              </Heading>
            </motion.div>
            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
            >
              <Text size="lg" variant="secondary" className="max-w-2xl">
                A diverse group of individuals passionate about AI and its
                potential to transform education and technology.
              </Text>
            </motion.div>
          </div>
          {/* Team Members Grid */}
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12"
          >
            {/* Team Member Card */}
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className={activeMember === member.id ? "z-20" : ""}
              >
                <TeamMemberCard
                  member={member}
                  activeMember={activeMember}
                  setActiveMember={setActiveMember}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Open Source Contributors Section */}
          <div className="mt-20" id="open-source-contributors">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <button
                onClick={() => copyToClipboard("open-source-contributors")}
                className="group inline-flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Heading level="h2" animate={false} className="mb-2">
                  Open Source Contributors
                </Heading>
                <FiHash
                  className="text-[var(--theme-text-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2"
                  size={28}
                />
              </button>
              <Text
                size="sm"
                variant="secondary"
                className="max-w-prose mx-auto"
              >
                Thanks to everyone helping build and improve this project.
              </Text>
            </motion.div>

            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {contributors.map((contrib) => (
                <motion.div key={contrib.url} variants={cardVariants}>
                  <a
                    href={contrib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <TiltCard
                      glareMaxOpacity={0.2}
                      scale={1.05}
                      gradient
                      hoverable
                      animated={false}
                      tiltClassName="w-full h-full transition-all rounded-lg"
                      className="h-full flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[var(--theme-card-bg)]/50 border border-[var(--theme-card-border)] mb-3 flex items-center justify-center text-[var(--theme-text-accent)] overflow-hidden relative">
                        <div className="absolute -bottom-0 left-0 w-full h-full bg-linear-to-tl from-[var(--theme-bg)]/20 via-[var(--theme-card-bg)]/10 to-[var(--theme-bg)]/5"></div>
                        <img
                          src={contrib.image}
                          alt={contrib.name}
                          className="w-full h-full object-cover rounded-full relative z-10"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold text-[var(--theme-text-primary)]">
                          {contrib.name}
                        </span>
                        <svg
                          className="w-5 h-5 text-[var(--theme-text-accent)]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                    </TiltCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
