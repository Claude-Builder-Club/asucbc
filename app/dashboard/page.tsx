"use client";

import { useSession } from "@/lib/auth-client";
import { Heading, Skeleton } from "@/app/components/ui";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  const name = session?.user?.name?.trim() ?? "";
  const parts = name.split(/\s+/);
  const firstName = parts[0] || "Member";

  return (
    <div>
      <Heading level="h3" gradient>
        {isPending ? (
          <Skeleton variant="text" width="60%" height="2.25rem" />
        ) : (
          <>Welcome {firstName} to the Claude Builder Club!</>
        )}
      </Heading>
    </div>
  );
}
