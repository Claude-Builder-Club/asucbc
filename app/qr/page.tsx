'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heading, Text, Card, Button } from '../components/ui';

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

const qrCardVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -3 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 0.8,
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

export default function QRPage() {
  const clubUrl = 'https://claudebuilder.club';
  const instagram = '@asu.cbc';
  const instagramUrl = `https://instagram.com/${instagram.replace('@', '')}`;

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] relative overflow-y-auto">
      <Header />
      <div className="font-sans p-8 pb-20 sm:p-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.div variants={badgeVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-card-bg)] border-2 border-[var(--theme-card-border)] rounded-full">
                <Sparkles className="w-4 h-4 text-[var(--theme-text-accent)]" />
                <Text size="sm" className="font-semibold text-[var(--theme-text-accent)]">
                  Connect With Us
                </Text>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Heading level="h1" animate={false} className="mb-4">
                Claude Builder Club
              </Heading>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
                Scan the QR code or use the links below to visit our website and follow us on Instagram
              </Text>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - QR Code */}
            <motion.div
              variants={qrCardVariants}
              className="flex justify-center lg:justify-end"
            >
              <Card
                hoverable
                gradient
                animated={false}
                className="inline-block p-8 sm:p-10"
              >
                <div className="bg-white p-6 rounded-lg shadow-inner">
                  <QRCodeSVG
                    value={clubUrl}
                    size={280}
                    level="H"
                    includeMargin={false}
                    fgColor="#1a1a1a"
                    bgColor="transparent"
                  />
                </div>

                <div className="mt-6 text-center">
                  <Text size="sm" variant="secondary">
                    Point your camera here
                  </Text>
                </div>
              </Card>
            </motion.div>

            {/* Right side - Info & Links */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="space-y-4">
                <Heading level="h2" animate={false}>
                  Join Our Community
                </Heading>
                <Text variant="secondary" className="max-w-md mx-auto lg:mx-0">
                  Scan the QR code to visit our website and learn more about building with Claude AI at Arizona State University.
                </Text>
              </div>

              {/* Action Cards */}
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <a
                    href={clubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card hoverable gradient animated={false} className="group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <Heading level="h4" animate={false} className="mb-2 group-hover:text-[var(--theme-text-accent)] transition-colors">
                            Visit Website
                          </Heading>
                          <Text size="sm" variant="secondary" className="break-all">
                            {clubUrl}
                          </Text>
                        </div>
                        <ExternalLink className="w-6 h-6 text-[var(--theme-text-accent)] flex-shrink-0" />
                      </div>
                    </Card>
                  </a>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card hoverable gradient animated={false} className="group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <Heading level="h4" animate={false} className="mb-2 group-hover:text-[var(--theme-text-accent)] transition-colors">
                            Follow on Instagram
                          </Heading>
                          <Text size="sm" variant="secondary">
                            {instagram}
                          </Text>
                        </div>
                        <Instagram className="w-6 h-6 text-[var(--theme-text-accent)] flex-shrink-0" />
                      </div>
                    </Card>
                  </a>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <a
                  href={clubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="primary" size="lg" fullWidth>
                    <ExternalLink className="w-5 h-5" />
                    <span>Visit Site</span>
                  </Button>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="secondary" size="lg" fullWidth>
                    <Instagram className="w-5 h-5" />
                    <span>Follow Us</span>
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Info Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <Card gradient animated={false} className="max-w-3xl mx-auto">
              <div className="space-y-3">
                <Heading level="h3" animate={false}>
                  About the Club
                </Heading>
                <Text variant="secondary">
                  The Arizona State University Claude Builder Club is dedicated to exploring the
                  cutting-edge capabilities of Anthropic's Claude AI. We foster innovation, collaboration,
                  and learning in the rapidly evolving field of artificial intelligence.
                </Text>
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.8 }}
            className="mt-16 pt-8"
          >
            <Footer />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
