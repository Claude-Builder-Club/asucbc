"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button, Divider } from "@/app/components/ui";
import {
  LayoutDashboard,
  Inbox,
  Trophy,
  Sparkles,
  UserPlus,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { label: "Hackathon Portal", href: "/dashboard/hackathon", icon: Trophy },
  { label: "Claude Pro", href: "/dashboard/claude-access", icon: Sparkles },
  {
    label: "Officer Applications",
    href: "/dashboard/officer-applications",
    icon: UserPlus,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = session?.user?.id;

  //Memoizing Inbox Unread Messages Function
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/inbox/unread-count?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch {}
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [userId, fetchUnreadCount]);

  return (
    <aside
      className="mesh-background-header flex h-full w-64 flex-col border-r px-4 py-6 backdrop-blur-md"
      style={{
        borderColor: "var(--sidebar-border)",
        color: "var(--sidebar-foreground)",
      }}
    >
      <Button
        variant="ghost"
        fullWidth
        className="justify-start gap-2 px-3 py-2"
        onClick={() => router.push("/dashboard")}
      >
        <LayoutDashboard size={18} />
        <span className="text-lg font-medium">Dashboard</span>
      </Button>

      <Divider variant="gradient" className="my-4" />

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            fullWidth
            className="justify-start gap-2 px-3 py-2.5 text-sm font-medium"
            onClick={() => router.push(item.href)}
          >
            {item.label === "Inbox" ? (
              <span className="relative">
                <item.icon size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
            ) : (
              <item.icon size={16} />
            )}
            {item.label}
          </Button>
        ))}
      </nav>

      <Divider variant="gradient" className="my-4" />

      <Button
        variant="ghost"
        fullWidth
        className="gap-2"
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
      >
        <LogOut size={16} />
        Sign Out
      </Button>
    </aside>
  );
}
