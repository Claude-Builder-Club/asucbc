"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div>
      Dashboard
      <button
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
