import { showHackathonPromo } from "@/app/theme-config";

/**
 * Navigation Configuration
 * Single source of truth for all site navigation
 */

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  category: "main" | "hidden" | "external";
  showInHeader?: boolean;
  showInCommandMenu?: boolean;
  isExternal?: boolean;
  keywords?: string[];
  icon?: string;
  umamiEvent?: string;
  isConditional?: boolean;
  isVisible?: () => boolean;
  variant?: "primary" | "secondary" | "default";
}

/**
 * Get all navigation items
 * Includes conditional logic for environment-controlled pages
 */
export const getNavigationItems = (): NavigationItem[] => {
  const items: NavigationItem[] = [
    // Main navigation pages
    {
      label: "Home",
      href: "/",
      description: "Homepage - ASU Claude Builder Club",
      category: "main",
      showInHeader: false, // Logo serves as home link
      showInCommandMenu: true,
      keywords: ["home", "main", "index", "start"],
      icon: "🏠",
      umamiEvent: "Nav - Home",
    },
    {
      label: "About",
      href: "/about",
      description: "Learn about ASU Claude Builder Club",
      category: "main",
      showInHeader: true,
      showInCommandMenu: true,
      keywords: ["about", "info", "information", "club"],
      icon: "ℹ️",
      umamiEvent: "Nav - About",
      variant: "default",
    },
    {
      label: "Team",
      href: "/team",
      description: "Meet our team members",
      category: "main",
      showInHeader: true,
      showInCommandMenu: true,
      keywords: ["team", "members", "people", "staff"],
      icon: "👥",
      umamiEvent: "Nav - Team",
      variant: "default",
    },
    {
      label: "Industry",
      href: "/industry",
      description: "Collaborate with us!",
      category: "main",
      showInHeader: true,
      showInCommandMenu: true,
      keywords: ["industry"],
      icon: "⚙️",
      umamiEvent: "Nav - Industry",
      variant: "default",
    },
    {
      label: "Contact",
      href: "/contact",
      description: "Contact us!",
      category: "main",
      showInHeader: true,
      showInCommandMenu: true,
      keywords: ["contact"],
      icon: "📞",
      umamiEvent: "Nav - Contact",
      variant: "default",
    },

    // Conditional pages
    {
      label: "Hackathon",
      href: "/hackathon",
      description: "View hackathon information and sign up",
      category: "main",
      showInHeader: true,
      showInCommandMenu: true,
      isConditional: true,
      isVisible: () => showHackathonPromo,
      keywords: ["hackathon", "event", "competition", "coding"],
      icon: "🚀",
      umamiEvent: "Nav - Hackathon",
      variant: "secondary",
    },
    // Hidden pages (not in header but accessible via command menu)
    {
      label: "Devs",
      href: "/devs",
      description: "UI component showcase for developers",
      category: "hidden",
      showInHeader: false,
      showInCommandMenu: true,
      isExternal: true,
      keywords: ["devs", "developers", "components", "showcase", "ui"],
      icon: "🛠️",
      umamiEvent: "Nav - Devs",
    },
    // Auth link
    {
      label: "Join Us",
      href: "/login",
      description: "Sign in to your account",
      category: "main",
      showInHeader: true,
      showInCommandMenu: false,
      isExternal: false,
      keywords: ["join", "signup", "register", "membership"],
      icon: "✨",
      umamiEvent: "Header - Join Us",
      variant: "primary",
    },
    // Login command menu item
    {
      label: "Login",
      href: "/login",
      description: "Sign in to your account",
      category: "main",
      showInHeader: false,
      showInCommandMenu: true,
      isExternal: false,
      keywords: [
        "login",
        "signin",
        "sign in",
        "log in",
        "authenticate",
        "account",
      ],
      icon: "🔐",
      umamiEvent: "Command Menu - Login",
    },
  ];

  return items;
};

/**
 * Get items visible in header navigation
 */
export const getHeaderNavigationItems = (): NavigationItem[] => {
  return getNavigationItems().filter((item) => {
    if (!item.showInHeader) return false;
    if (item.isConditional && item.isVisible) {
      return item.isVisible();
    }
    return true;
  });
};

/**
 * Get items visible in command menu
 */
export const getCommandMenuItems = (): NavigationItem[] => {
  return getNavigationItems().filter((item) => {
    if (!item.showInCommandMenu) return false;
    if (item.isConditional && item.isVisible) {
      return item.isVisible();
    }
    return true;
  });
};

/**
 * Group items by category for command menu
 */
export const getGroupedCommandMenuItems = () => {
  const items = getCommandMenuItems();

  return {
    main: items.filter((item) => item.category === "main"),
    hidden: items.filter((item) => item.category === "hidden"),
    external: items.filter((item) => item.category === "external"),
  };
};
