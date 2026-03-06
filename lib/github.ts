import { GitHubContributor, Contributor } from "@/types/github";

const GITHUB_API_URL =
  "https://api.github.com/repos/Claude-Builder-Club/asucbc/contributors";

export async function fetchContributors(): Promise<Contributor[]> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
      // Cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data: GitHubContributor[] = await response.json();

    return data
      .filter((c) => c.type === "User")
      .sort((a, b) => b.contributions - a.contributions)
      .map((c) => ({
        name: c.login,
        url: c.html_url,
        image: c.avatar_url,
      }));
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}
