"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradualBlur from "./ui/GradualBlur";
import { getHeaderNavigationItems } from "@/lib/navigation-config";
import CommandMenu from "./CommandMenu";
import { showHackathonPromo } from "@/app/theme-config";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const navigationItems = getHeaderNavigationItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Keyboard shortcut for command menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandMenuOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Only animate on first visit
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const animated = sessionStorage.getItem('headerAnimated');
    if (animated) {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem('headerAnimated', 'true');
    }
  }, []);

  const navItemVariants = {
    hidden: { opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: hasAnimated ? { duration: 0 } : {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto" as const,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <header className="w-full mesh-background-header top-0 sticky z-50 backdrop-blur-md border-b border-[var(--theme-card-border)] shadow-sm">
      {/* <GradualBlur position="bottom" strength={3} height="4rem" className={`z-0 relative`} /> */}
      <div className="px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex items-center justify-between h-16 overflow-visible">
          {/* Logo on the left */}
          <motion.div
            initial={{ opacity: hasAnimated ? 1 : 0, x: hasAnimated ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={hasAnimated ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 15 }}
          >
            <Link
              href="/"
              className={`relative z-10 group hover:scale-105 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 min-h-[48px] flex items-center touch-manipulation`}
              data-umami-event="Logo Click"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer font-sans whitespace-nowrap">
                <span className="text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-accent)] transition-colors duration-200">
                  ANTHROPIC
                </span>{" "}
                <span className="text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-accent)] transition-colors duration-200">
                  @ ASU
                </span>
              </h1>
            </Link>
          </motion.div>

          {/* Navigation buttons in the middle */}
          <nav className="hidden lg:flex items-center space-x-8 overflow-visible">
            {navigationItems.map((item, index) => {
              const isDefault = item.variant === "default" || !item.variant;
              const isPrimary = item.variant === "primary";
              const isSecondary = item.variant === "secondary";

              const baseClasses = `relative z-10 transition-all duration-200 font-medium font-sans px-${isDefault ? '4' : '6'} py-3 rounded-${isDefault ? 'md' : 'lg'} min-h-[48px] flex items-center touch-manipulation`;
              
              const variantClasses = isDefault
                ? "text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] hover:bg-white/10"
                : isPrimary
                ? "bg-[var(--theme-button-bg)] text-white hover:bg-[var(--theme-button-hover-bg)] hover:shadow-lg"
                : "bg-[var(--theme-button-alternate-bg)] text-[var(--theme-button-alternate-text)] hover:bg-[var(--theme-button-hover-bg)] hover:text-[var(--theme-button-hover-text)] hover:shadow-lg border border-transparent hover:border-[var(--theme-button-hover-border)]";

              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  className={isSecondary ? "relative z-10" : undefined}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: isDefault ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      className={`${baseClasses} ${variantClasses} ${isPrimary ? 'z-20' : ''} ${isSecondary ? 'overflow-visible' : ''}`}
                      data-umami-event={item.umamiEvent}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Command Menu Trigger Button */}
            <motion.div
              custom={navigationItems.length}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCommandMenuOpen(true)}
                className="relative z-10 text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] transition-all duration-200 p-3 rounded-md hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
                aria-label="Open command menu"
                title="Search (⌘K)"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </nav>

          {/* Mobile menu button and command menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCommandMenuOpen(true)}
              className="text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] transition-colors duration-200 font-sans p-2 rounded-lg hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
              aria-label="Open command menu"
              data-umami-event="Mobile Command Menu Toggle"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              onClick={toggleMobileMenu}
              className="text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] transition-colors duration-200 font-sans p-2 rounded-lg hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
              aria-label="Toggle mobile menu"
              data-umami-event="Mobile Menu Toggle"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-[var(--theme-card-bg)] backdrop-blur-sm border-t border-[var(--theme-card-border)] rounded-2xl">
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/about"
                    className={`flex px-3 py-4 text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] hover:bg-[var(--theme-text-accent)]/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - About"
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/team"
                    className={`flex px-3 py-4 text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] hover:bg-[var(--theme-text-accent)]/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Team"
                  >
                    Team
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/industry"
                    className={`flex px-3 py-4 text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] hover:bg-[var(--theme-text-accent)]/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Industry"
                  >
                    Industry
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/contact"
                    className={`flex px-3 py-4 text-[var(--theme-text-primary)] hover:text-[var(--theme-text-accent)] hover:bg-[var(--theme-text-accent)]/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Contact"
                  >
                    Contact
                  </Link>
                </motion.div>
                {showHackathonPromo && (
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href="/hackathon"
                      className={`relative z-20 flex px-3 py-4 bg-[var(--theme-button-alternate-bg)] text-[var(--theme-button-alternate-text)] hover:bg-[var(--theme-button-hover-bg)] hover:text-[var(--theme-button-hover-text)] transition-all duration-300 ease-in-out font-medium text-base font-sans border border-[var(--theme-button-alternate-border)] hover:border-[var(--theme-button-hover-border)] rounded-lg min-h-[48px] items-center touch-manipulation`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-umami-event="Mobile Nav - Hackathon"
                    >
                      Hackathon
                    </Link>
                  </motion.div>
                )}
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="https://docs.google.com/forms/d/e/1FAIpQLScP9LuFwiHEx806tv9zczjCIEzqO1Zjb-FjB4XWoa6BS1NNKQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative z-20 flex px-3 py-4 bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] hover:bg-[var(--theme-button-hover-bg)] hover:text-[var(--theme-button-hover-text)] transition-all duration-300 ease-in-out font-medium text-base font-sans border border-[var(--theme-button-border)] hover:border-[var(--theme-button-hover-border)] rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Join Us"
                  >
                    Join Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command Menu */}
      <CommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} />
    </header>
  );
}
