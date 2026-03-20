"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Heading, Text, Card, Button } from "../components/ui";
import Link from "next/link";

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
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

interface ScheduleItemProps {
  time: string;
  title: string;
  description?: string;
  delay?: number;
}

function ScheduleItem({
  time,
  title,
  description,
  delay = 0,
}: ScheduleItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: delay,
      }}
      className="relative pl-8 pb-8 border-l-2 border-[var(--theme-text-accent)] last:border-l-0 last:pb-0"
    >
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--theme-text-accent)] border-2 border-[var(--theme-card-bg)]" />
      <div className="font-bold text-[var(--theme-text-accent)] text-sm mb-1">
        {time}
      </div>
      <h3 className="font-bold text-lg mb-1 text-[var(--theme-text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--theme-text-dark)] text-sm leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

interface TrackCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

function TrackCard({ icon, title, description, delay = 0 }: TrackCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 15,
        delay: delay,
      }}
      className="h-full"
    >
      <Card gradient animated={false} className="h-full flex flex-col relative">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="font-bold text-xl mb-2 text-[var(--theme-text-primary)]">
          {title}
        </h3>
        <p className="text-[var(--theme-text-dark)] leading-relaxed flex-1">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}

interface SponsorCardProps {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  delay?: number;
}

function SponsorCard({
  name,
  url,
  logo,
  description,
  delay = 0,
}: SponsorCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const content = (
    <div className="h-full flex flex-col items-center justify-center rounded-xl p-6 bg-[var(--theme-card-bg)] border-2 border-[var(--theme-card-border)] hover:border-[var(--theme-text-accent)] shadow-lg hover:shadow-2xl transition-all">
      {logo && (
        <div className="relative w-full h-16 flex items-center justify-center mb-4">
          <img
            src={logo}
            alt={`${name} logo`}
            className={`max-w-full max-h-full object-contain ${name === "Airpost" ? "invert dark:invert-0" : name === "Tamagrow" ? "" : "dark:invert dark:hue-rotate-180"}`}
          />
        </div>
      )}
      <h3 className="font-bold text-lg text-center text-[var(--theme-text-primary)] mb-2">
        {name}
      </h3>
      {description && (
        <p className="text-sm text-center text-[var(--theme-text-dark)] leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
              transition: {
                delay,
                type: "spring",
                stiffness: 60,
                damping: 15,
              },
            }
          : { opacity: 0, scale: 0.9 }
      }
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
      className="h-full"
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full block"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}

export default function Hackathon2() {
  return (
    <div className="max-h-full flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-block mb-4 px-6 py-2 bg-[var(--theme-text-accent)] text-[var(--theme-card-bg)] rounded-full font-bold text-sm tracking-wider">
              MARCH 20-22, 2026
            </div>

            <Heading
              level="h1"
              animate={false}
              className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 leading-none"
            >
              <span className="text-[var(--theme-text-primary)]">
                Claude Builder Club
              </span>
              <br />
              <span className="text-[var(--theme-text-accent)]">Hackathon</span>
            </Heading>
            <Text
              size="xl"
              className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed"
            >
              2+ days of innovation and creativity. Build the future with AI.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/hackathon2/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Register Now
                </Button>
              </Link>
              <div className="text-[var(--theme-text-dark)]">
                <p className="font-bold">PSH 150 / 151</p>
                <p className="text-sm">Fri 4 PM – Sun 6 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-12 px-4 sm:px-8 bg-gradient-to-b from-[var(--theme-gradient-accent)] to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              gradient
              animated={false}
              className="relative overflow-hidden border-2 border-[var(--theme-text-accent)]"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-3xl">📍</span>
                  <h2 className="text-3xl font-bold text-[var(--theme-text-primary)]">
                    Event Information
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {/* Date and Time */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--theme-text-accent)] to-[var(--theme-button-alternate-bg)] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-[var(--theme-text-primary)]">
                      Date & Time
                    </h3>
                    <p className="text-[var(--theme-text-dark)]">
                      <strong>Friday, March 20, 2026</strong> at 4:00 PM
                      <br />
                      to
                      <br />
                      <strong>Sunday, March 22, 2026</strong> at 6:00 PM
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--theme-text-accent)] to-[var(--theme-button-alternate-bg)] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-[var(--theme-text-primary)]">
                      Location
                    </h3>
                    <p className="text-[var(--theme-text-dark)]">
                      <strong>PSH 150 / 151</strong>
                      <br />
                      Physical Sciences Building
                      <br />
                      Arizona State University, Tempe Campus
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="p-4 bg-[var(--theme-text-accent)]/10 rounded-lg border-l-4 border-[var(--theme-text-accent)]">
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                    <span className="text-[var(--theme-text-accent)]">
                      ⚠️ Important:
                    </span>{" "}
                    If you registered on Sun Devil Connect, you must also
                    register here to confirm your attendance. Non-ASU and
                    graduated students are welcome to participate in the
                    hackathon, but they are not eligible to receive prizes.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What to Build Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Heading level="h2" className="text-4xl sm:text-5xl font-bold mb-4">
              What Will You{" "}
              <span className="text-[var(--theme-text-accent)]">Build?</span>
            </Heading>
            <Text size="lg" variant="secondary">
              Explore these focus areas or surprise us with something unique
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            <TrackCard
              icon="🩺"
              title="Biology, Physical, & Mental Health"
              description="Make healthcare more accessible or help people manage physical/mental health"
              delay={0}
            />
            <TrackCard
              icon="🤖"
              title="AI Tooling"
              description="Build innovative developer tools, workflows, and infrastructure that make AI more useful, reliable, or accessible"
              delay={0.1}
            />
            <TrackCard
              icon="📚"
              title="Economic Empowerment & Education"
              description="Remove barriers to learning and opportunity"
              delay={0.2}
            />
            <TrackCard
              icon="🎨"
              title="Creative Flourishing"
              description="Amplify human creativity and help people find meaning"
              delay={0.3}
            />
            <TrackCard
              icon="🗳️"
              title="Governance & Collaboration"
              description="Help people participate in democracy or work together better"
              delay={0.4}
            />
            <TrackCard
              icon="🚀"
              title="Wild Card"
              description="Have a unique idea that doesn't fit these categories? We want to see it!"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-[var(--theme-gradient-accent)] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Heading level="h2" className="text-4xl sm:text-5xl font-bold mb-4">
              Event{" "}
              <span className="text-[var(--theme-text-accent)]">Schedule</span>
            </Heading>
            <Text size="lg" variant="secondary">
              Tentative schedule - subject to change
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Day 1 */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-[var(--theme-text-accent)]">
                Day 1 - Friday
              </h3>
              <ScheduleItem
                time="4:00 PM"
                title="Registration & Welcome"
                description="Check-in and meet fellow hackers"
              />
              <ScheduleItem
                time="5:00 PM"
                title="Opening Ceremony"
                description="Event kickoff and project ideation"
              />
              <ScheduleItem
                time="6:00 PM"
                title="Hacking Begins!"
                description="Start building your projects"
              />
              <ScheduleItem
                time="8:00 PM"
                title="Evening Activities"
                description="Dinner and networking"
              />
            </div>

            {/* Day 2 */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-[var(--theme-text-accent)]">
                Day 2 - Saturday
              </h3>
              <ScheduleItem
                time="9:00 AM"
                title="Morning Check-in"
                description="Breakfast and status updates"
              />
              <ScheduleItem
                time="12:00 PM"
                title="Lunch Break"
                description="Refuel and recharge"
              />
              <ScheduleItem
                time="3:00 PM"
                title="Workshop Sessions"
                description="Learn new skills and techniques"
              />
              <ScheduleItem
                time="6:00 PM"
                title="Dinner & Activities"
                description="Evening meal and fun activities"
              />
            </div>

            {/* Day 3 */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-[var(--theme-text-accent)]">
                Day 3 - Sunday
              </h3>
              <ScheduleItem
                time="9:00 AM"
                title="Final Sprint + Check-In"
                description="Polish your projects"
              />
              <ScheduleItem
                time="2:00 PM"
                title="Submissions Due"
                description="Submit your projects for judging"
              />
              <ScheduleItem
                time="5:00 PM"
                title="Awards Ceremony"
                description="Winners announced and closing remarks"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-[var(--theme-gradient-accent)] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Heading level="h2" className="text-4xl sm:text-5xl font-bold mb-4">
              Our{" "}
              <span className="text-[var(--theme-text-accent)]">Sponsors</span>
            </Heading>
            <Text size="lg" variant="secondary">
              Thank you to our amazing sponsors who make this event possible
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            <SponsorCard
              name="Serpico AI Learning Center"
              url="https://www.ailearningcenter.ai/"
              logo="/assets/hackathon/sponsors/serpico.avif"
              description="Hiring AI Operations Specialist (part-time)"
              delay={0}
            />
            <SponsorCard
              name="Airpost"
              url="https://www.airpost.ai/"
              logo="/assets/hackathon/sponsors/airpost.svg"
              description="Hiring Full-Time AI SDE — technical & non-technical welcome"
              delay={0.05}
            />
            <SponsorCard
              name="Insforge"
              url="https://insforge.dev/"
              logo="/assets/hackathon/sponsors/insforge.svg"
              description="Free API credits for participants (YC '26)"
              delay={0.1}
            />
            <SponsorCard
              name="Automation Interns"
              url="https://www.automationinterns.com/"
              logo="/assets/hackathon/sponsors/automation-interns.png"
              description="Hiring AI SDE & Operations Interns"
              delay={0.15}
            />
            <SponsorCard
              name="Red Bull"
              url="https://redbull.com"
              logo="/assets/hackathon/sponsors/redbull.png"
              description="Free RedBull"
              delay={0.2}
            />
            <SponsorCard
              name="Tamagrow"
              url="https://tamagrow.app/"
              logo="/assets/hackathon/sponsors/tamagrow.webp"
              description="Turn GitHub commits into social posts"
              delay={0.25}
            />
            <SponsorCard
              name="TinyFish"
              url="https://www.tinyfish.ai/"
              logo="/assets/hackathon/sponsors/tinyfish.svg"
              description="Free suite credits, prizes for social posts & cookbook PRs, accelerator golden tickets for winners. Hiring Product Growth Intern"
              delay={0.3}
            />
            <SponsorCard
              name="ada."
              url="https://tryada.app/"
              logo="/assets/hackathon/sponsors/ada.png"
              description={"The AI Secretary for your Phone.\nHiring AI SDE Intern — Summer 2026"}
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* Sponsorship CTA */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card gradient animated={false} className="text-center p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--theme-text-primary)]">
                Interested in{" "}
                <span className="text-[var(--theme-text-accent)]">
                  Sponsoring?
                </span>
              </h2>
              <Text size="lg" className="mb-6 max-w-2xl mx-auto">
                Support innovation and connect with talented developers building
                the future
              </Text>
              <Link href="/industry">
                <Button size="lg" className="text-lg px-10 py-6">
                  Become a Sponsor
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[var(--theme-gradient-accent)] to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heading level="h2" className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to{" "}
              <span className="text-[var(--theme-text-accent)]">Create?</span>
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable weekend of innovation, collaboration,
              and creativity. All skill levels welcome!
            </Text>
            <Link href="/hackathon2/signup">
              <Button size="lg" className="text-lg px-10 py-6">
                Sign Up Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
