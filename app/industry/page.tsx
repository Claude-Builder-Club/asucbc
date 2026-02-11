"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Heading, Text, TiltCard, Container } from "../components/ui";

const currentSponsor = {
  name: "Anthropic",
  description:
    "Anthropic partners with us to accelerate applied AI research and empower student teams building on Claude. Together we explore ethical AI deployments and create flagship experiences for the ASU community.",
  logo: "/assets/hackathon/sponsors/anthropic.png",
  url: "https://www.anthropic.com",
};

const pastSponsors = [
  {
    name: "Polymarket",
    logo: "/assets/hackathon/sponsors/polymarket.svg",
    url: "https://polymarket.com",
  },
  {
    name: "ether.fi",
    logo: "/assets/hackathon/sponsors/etherfi.png",
    url: "https://www.ether.fi",
  },
  {
    name: "Base",
    logo: "/assets/hackathon/sponsors/base.svg",
    url: "https://www.base.org",
  },
  {
    name: "Redbull",
    logo: "/assets/hackathon/sponsors/redbull.png",
    url: "https://www.redbull.com",
  },
  {
    name: "Acorns",
    logo: "/assets/hackathon/sponsors/acorns.svg",
    url: "https://www.acorns.com",
  },
  {
    name: "Streetsmart",
    logo: "/assets/hackathon/sponsors/streetsmart.svg",
    url: "https://streetsmart.org",
  },
];

const partnershipFaq = [
  {
    question: "How is ASU Claude Builder Club structured?",
    answer:
      "Each semester, we partner with clients to build custom products and services tailored to their needs. We assign dedicated project leaders and developers who work directly with companies to implement a fully-fledged project. Every team will meet weekly and check in throughout the semester.",
  },
  {
    question: "What is the timeframe for an ASU Claude Builder Club project?",
    answer:
      "Projects run over 10-12 weeks. We kick off in week 1 after a pitch call and a formal statement of work, demo progress around week 5, and present the final product with documentation and support by the semester's end.",
  },
  {
    question: "What value does ASU Claude Builder Club provide?",
    answer:
      "You get a high-impact solution built by top ASU talent, increased campus visibility, and a chance to support a student organization developing future tech leaders.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
    },
  }),
};

export default function IndustryPage() {
  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden">
      <Header />
      <main className="pb-24 pt-12 sm:pt-16">
        <Container size="lg" animate className="space-y-12">
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="space-y-6"
            >
              <Heading
                level="h1"
                animate={false}
                className="text-4xl sm:text-5xl"
              >
                Build With ASU's AI Native Team
              </Heading>
              <Text size="lg" variant="secondary" className="max-w-2xl">
                We collaborate with ambitious companies to prototype and ship
                industry-grade AI products. Tap into a multidisciplinary roster
                of engineers, designers, and operators who work alongside your
                team from pitch to launch.
              </Text>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-transparent bg-[var(--theme-button-bg)] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[var(--theme-button-hover-bg)] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-text-accent)]"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Link
                href={currentSponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
                aria-label={`Visit ${currentSponsor.name}`}
              >
                <TiltCard
                  gradient
                  hoverable
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  transitionSpeed={600}
                  tiltClassName="h-full"
                  className="h-full"
                >
                  <div className="space-y-6">
                    <div className="relative h-16 w-44 sm:h-20 sm:w-56">
                      <Image
                        src={currentSponsor.logo}
                        alt={`${currentSponsor.name} logo`}
                        fill
                        sizes="(max-width: 640px) 200px, 224px"
                        className="object-contain drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] dark:invert dark:hue-rotate-180"
                        priority
                      />
                    </div>
                    <Text
                      variant="secondary"
                      className="text-sm leading-relaxed"
                    >
                      {currentSponsor.description}
                    </Text>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          </section>

          <section id="partnership" className="space-y-8">
            <div>
              <Text
                size="sm"
                variant="secondary"
                className="uppercase tracking-[0.35em]"
              >
                Partnership Info
              </Text>
              <Heading level="h2" animate={false} className="mt-2 text-3xl">
                Work With Us Like an Extension of Your Team
              </Heading>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {partnershipFaq.map((item, index) => (
                <motion.div
                  key={item.question}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                >
                  <TiltCard
                    glareMaxOpacity={0.1}
                    tiltMaxAngleX={6}
                    tiltMaxAngleY={6}
                    scale={1.01}
                    transitionSpeed={600}
                    hoverable
                    gradient
                    tiltClassName="h-full"
                    className="h-full"
                  >
                    <Heading
                      level="h6"
                      animate={false}
                      className="!text-lg sm:!text-xl mb-3 font-semibold"
                    >
                      {item.question}
                    </Heading>
                    <Text
                      variant="secondary"
                      size="sm"
                      className="!text-sm leading-6"
                    >
                      {item.answer}
                    </Text>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <Heading level="h2" animate={false}>
              Past Sponsors
            </Heading>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {pastSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                >
                  <Link
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                    aria-label={`Visit ${sponsor.name}`}
                  >
                    <TiltCard
                      glareMaxOpacity={0.12}
                      tiltMaxAngleX={8}
                      tiltMaxAngleY={8}
                      animated={false}
                      hoverable
                      tiltClassName="h-full"
                      className="flex items-center justify-center py-6"
                      childrenAreRelative
                    >
                      <div className="relative h-10 w-24 sm:h-12 sm:w-28">
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          sizes="112px"
                          className="object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] dark:invert dark:hue-rotate-180"
                        />
                      </div>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </Container>
        <div className="mt-16">
          <Footer />
        </div>
      </main>
    </div>
  );
}
