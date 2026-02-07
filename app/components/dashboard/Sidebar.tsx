"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Heading, Button, Divider } from "@/app/components/ui";

const navItems = [
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Apply for Hackathon", href: "/dashboard/hackathon" },
  { label: "Officer Applications", href: "/dashboard/officer-applications" },
  { label: "Missing Claude Pro", href: "/dashboard/missing-claude-pro" },
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
      <Heading level="h5" animate={false}>
        Dashboard
      </Heading>

      <Divider variant="gradient" className="my-4" />

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
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
