'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Sparkles, MessageCircle } from 'lucide-react';
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
  const discordUrl = 'https://discord.gg/PRh8F2XebB';

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
                <Text size="lg" className="font-semibold text-[var(--theme-text-accent)]">
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
                Scan the QR codes to join our Discord community, visit our website, and follow us on Instagram
              </Text>
            </motion.div>
          </div>

          {/* QR Code Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Discord QR - Featured */}
            <motion.div
              variants={qrCardVariants}
              className="flex justify-center md:col-span-2 lg:col-span-1"
            >
              <Card
                hoverable
                gradient
                animated={false}
                className="inline-block p-8 sm:p-10 w-full"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-[var(--theme-text-accent)]" />
                  <Heading level="h3" animate={false} className="text-[var(--theme-text-accent)]">
                    Join Discord
                  </Heading>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-inner aspect-square">
                  <QRCodeSVG
                    value={discordUrl}
                    size={240}
                    level="H"
                    includeMargin={false}
                    fgColor="#5865F2"
                    bgColor="transparent"
                    className='w-full h-full contrast-50'
                  />
                </div>

                <div className="mt-6 text-center">
                  <Text size="lg" variant="secondary" className="mb-3">
                    Scan to join our community
                  </Text>
                </div>
              </Card>
            </motion.div>

            {/* Website QR */}
            <motion.div
              variants={qrCardVariants}
              className="flex justify-center"
            >
              <Card
                hoverable
                gradient
                animated={false}
                className="inline-block p-8 sm:p-10 w-full"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <ExternalLink className="w-5 h-5 text-[var(--theme-text-accent)]" />
                  <Heading level="h4" animate={false}>
                    Website
                  </Heading>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-inner aspect-square">
                  <QRCodeSVG
                    value={clubUrl}
                    size={240}
                    level="H"
                    includeMargin={false}
                    fgColor="#1a1a1a"
                    bgColor="transparent"
                    className='w-full h-full'
                  />
                </div>

                <div className="mt-6 text-center">
                  <Text size="lg" variant="secondary">
                    Visit our site
                  </Text>
                </div>
              </Card>
            </motion.div>

            {/* Instagram QR */}
            <motion.div
              variants={qrCardVariants}
              className="flex justify-center"
            >
              <Card
                hoverable
                gradient
                animated={false}
                className="inline-block p-8 sm:p-10 w-full"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Instagram className="w-5 h-5 text-[var(--theme-text-accent)]" />
                  <Heading level="h4" animate={false}>
                    Instagram
                  </Heading>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-inner aspect-square">
                  <QRCodeSVG
                    value={instagramUrl}
                    size={240}
                    level="H"
                    includeMargin={false}
                    fgColor="#E4405F"
                    bgColor="transparent"
                    className='w-full h-full contrast-50'
                  />
                </div>

                <div className="mt-6 text-center">
                  <Text size="lg" variant="secondary">
                    {instagram}
                  </Text>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Quick Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          >
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] max-w-[300px]"
            >
              <Button variant="primary" size="lg" fullWidth>
                <MessageCircle className="w-5 h-5" />
                <span>Join Discord</span>
              </Button>
            </a>
            <a
              href={clubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] max-w-[300px]"
            >
              <Button variant="secondary" size="lg" fullWidth>
                <ExternalLink className="w-5 h-5" />
                <span>Visit Site</span>
              </Button>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] max-w-[300px]"
            >
              <Button variant="secondary" size="lg" fullWidth>
                <Instagram className="w-5 h-5" />
                <span>Follow Us</span>
              </Button>
            </a>
          </motion.div>

          {/* Bottom Info Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <Card gradient animated={false} className="max-w-3xl mx-auto">
              <div className="space-y-3">
                <Heading level="h3" animate={false}>
                  Why Join Discord?
                </Heading>
                <Text variant="secondary">
                  Our Discord is the hub for the ASU Claude Builder Club community. Get real-time support,
                  collaborate on projects, share your builds, participate in workshops, and connect with fellow
                  AI enthusiasts. Whether you're just starting or already building with Claude, you'll find your place here.
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
