import { fetchContributors } from "@/lib/github";
import TeamPageClient from "./TeamPageClient";

export default async function TeamPage() {
  const contributors = await fetchContributors();
  return <TeamPageClient contributors={contributors} />;
}
