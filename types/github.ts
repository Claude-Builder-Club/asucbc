export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  contributions: number;
}

export interface Contributor {
  name: string;
  url: string;
  image: string;
}
