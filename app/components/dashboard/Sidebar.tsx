"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Heading, Button, Divider } from "@/app/components/ui";

const navItems = [
  { label: "Hackathon Portal", href: "/dashboard/hackathon" },
  { label: "Claim Claude Pro", href: "/dashboard/claude-access" },
  { label: "Become an Officer", href: "/dashboard/officer-applications" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside
      className="flex h-full w-64 flex-col border-r px-4 py-6"
      style={{
        backgroundColor: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
        color: "var(--sidebar-foreground)",
      }}
    >
      <motion.a
        href="/dashboard"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--theme-text-accent)]/10"
      >
        <Heading level="h5" animate={false}>
          Dashboard
        </Heading>
      </motion.a>

      <Divider variant="gradient" className="my-4" />

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-lg px-3 py-2.5 text-sm font-medium border border-transparent transition-colors text-[var(--sidebar-foreground)] hover:bg-[var(--theme-text-accent)]/10 hover:text-[var(--theme-text-accent)] hover:border-[var(--theme-text-accent)]/30"
          >
            {item.label}
          </motion.a>
        ))}
      </nav>

      <Divider variant="gradient" className="my-4" />

      <Button
        variant="ghost"
        fullWidth
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
      >
        Sign Out
      </Button>
    </aside>
  );
}
