"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradualBlur from "./ui/GradualBlur";
import { getHeaderNavigationItems } from "@/lib/navigation-config";
import CommandMenu from "./CommandMenu";


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const navigationItems = getHeaderNavigationItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  //Keyboard shortcut for command menu
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

  //Only animate on first visit
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
    <header className="w-full mesh-background-header top-0 sticky z-50 backdrop-blur-md border-b border-(--theme-card-border)">
      <div className="px-6 sm:px-8 lg:px-12 relative z-20">
        <div className="flex items-center justify-between h-14 overflow-visible">
          {/*Logo on the left*/}
          <motion.div
            initial={{ opacity: hasAnimated ? 1 : 0, x: hasAnimated ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={hasAnimated ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 15 }}
          >
            <Link
              href="/"
              className="group flex items-center min-h-[44px] touch-manipulation"
              data-umami-event="Logo Click"
            >
              <h1 className="text-base sm:text-lg font-bold tracking-tight cursor-pointer font-sans whitespace-nowrap">
                <span className="text-(--theme-text-primary) group-hover:text-(--theme-text-accent) transition-colors duration-200">
                  ANTHROPIC
                </span>{" "}
                <span className="text-(--theme-text-primary)/50 group-hover:text-(--theme-text-accent)/70 transition-colors duration-200 font-normal">
                  @ ASU
                </span>
              </h1>
            </Link>
          </motion.div>

          {/*Desktop nav*/}
          <nav className="hidden lg:flex items-center gap-1 overflow-visible">
            {navigationItems.map((item, index) => {
              const isDefault = item.variant === "default" || !item.variant;
              const isPrimary = item.variant === "primary";
              const isSecondary = item.variant === "secondary";

              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                >
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    data-umami-event={item.umamiEvent}
                    className={
                      isDefault
                        ? "relative px-3 py-2 text-sm font-medium text-(--theme-text-primary)/70 hover:text-(--theme-text-primary) transition-colors duration-200 group flex items-center gap-1"
                        : isPrimary
                        ? "ml-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.03]"
                        : "ml-1 px-5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:shadow-md hover:scale-[1.03]"
                    }
                    style={
                      isPrimary
                        ? { background: "var(--theme-button-bg)", color: "var(--theme-button-text)" }
                        : isSecondary
                        ? { borderColor: "var(--theme-text-accent)", color: "var(--theme-text-accent)", background: "transparent" }
                        : {}
                    }
                  >
                    {item.label}
                    {isDefault && (
                      <span className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" style={{ background: "var(--theme-text-accent)" }} />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/*Search button*/}
            <motion.div custom={navigationItems.length} initial="hidden" animate="visible" variants={navItemVariants}>
              <button
                onClick={() => setIsCommandMenuOpen(true)}
                className="ml-2 p-2 rounded-lg text-(--theme-text-primary)/50 hover:text-(--theme-text-primary) transition-colors duration-200"
                aria-label="Open command menu"
                title="Search (⌘K)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </motion.div>
          </nav>

          {/*Mobile menu button and command menu button*/}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCommandMenuOpen(true)}
              className="text-(--theme-text-primary) hover:text-(--theme-text-accent) transition-colors duration-200 font-sans p-2 rounded-lg hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
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
              className="text-(--theme-text-primary) hover:text-(--theme-text-accent) transition-colors duration-200 font-sans p-2 rounded-lg hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
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

        {/*Mobile menu*/}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-(--theme-card-bg) backdrop-blur-sm border-t border-(--theme-card-border) rounded-2xl">
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/about"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - About"
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/team"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Team"
                  >
                    Team
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/industry"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Industry"
                  >
                    Industry
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/contact"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Contact"
                  >
                    Contact
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/apply"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Apply"
                  >
                    Apply
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/past-events"
                    className={`flex px-3 py-4 text-(--theme-text-primary) hover:text-(--theme-text-accent) hover:bg-(--theme-text-accent)/10 transition-all duration-200 font-medium font-sans rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Past Events"
                  >
                    Past Events
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/hackathon"
                    className={`relative z-20 flex px-3 py-4 bg-(--theme-button-alternate-bg) text-(--theme-button-alternate-text) hover:bg-(--theme-button-hover-bg) hover:text-(--theme-button-hover-text) transition-all duration-300 ease-in-out font-medium text-base font-sans border border-(--theme-button-alternate-border) hover:border-(--theme-button-hover-border) rounded-lg min-h-[48px] items-center touch-manipulation`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-umami-event="Mobile Nav - Hackathon"
                  >
                    Hackathon
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="https://docs.google.com/forms/d/e/1FAIpQLScP9LuFwiHEx806tv9zczjCIEzqO1Zjb-FjB4XWoa6BS1NNKQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative z-20 flex px-3 py-4 bg-(--theme-button-bg) text-(--theme-button-text) hover:bg-(--theme-button-hover-bg) hover:text-(--theme-button-hover-text) transition-all duration-300 ease-in-out font-medium text-base font-sans border border-(--theme-button-border) hover:border-(--theme-button-hover-border) rounded-lg min-h-[48px] items-center touch-manipulation`}
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

      {/*Command Menu*/}
      <CommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} />
    </header>
  );
}
