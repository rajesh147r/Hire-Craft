import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY || "",
});

export interface GitHubProject {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  topics: string[];
}

export async function searchProjectsBySkills(skills: string[]): Promise<GitHubProject[]> {
  try {
    const projects: GitHubProject[] = [];
    
    // Search for repositories for each missing skill
    for (const skill of skills.slice(0, 3)) { // Limit to 3 skills to avoid rate limits
      try {
        const searchQuery = `${skill} tutorial OR ${skill} example OR ${skill} project language:${getLanguageForSkill(skill)}`;
        
        const { data } = await octokit.rest.search.repos({
          q: searchQuery,
          sort: "stars",
          order: "desc",
          per_page: 3,
        });

        const skillProjects = data.items.map(repo => ({
          name: repo.name,
          description: repo.description || `Learn ${skill} with this project`,
          url: repo.html_url,
          stars: repo.stargazers_count || 0,
          language: repo.language || "Unknown",
          topics: repo.topics || [],
        }));

        projects.push(...skillProjects);
      } catch (error) {
        console.warn(`Failed to search for ${skill} projects:`, error);
      }
    }

    // Remove duplicates and sort by stars
    const uniqueProjects = projects
      .filter((project, index, self) => 
        index === self.findIndex(p => p.url === project.url)
      )
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 6); // Return top 6 projects

    return uniqueProjects;
  } catch (error) {
    console.error("GitHub API error:", error);
    return [];
  }
}

function getLanguageForSkill(skill: string): string {
  const skillLanguageMap: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    "c++": "C++",
    "c#": "C#",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    ruby: "Ruby",
    swift: "Swift",
    kotlin: "Kotlin",
    dart: "Dart",
    react: "JavaScript",
    angular: "TypeScript",
    vue: "JavaScript",
    nodejs: "JavaScript",
    django: "Python",
    flask: "Python",
    spring: "Java",
    express: "JavaScript",
    laravel: "PHP",
    rails: "Ruby",
  };

  return skillLanguageMap[skill.toLowerCase()] || "";
}

export async function getUserGitHubStats(username: string) {
  try {
    const { data: user } = await octokit.rest.users.getByUsername({
      username: username.replace(/.*github\.com\//, ""),
    });

    const { data: repos } = await octokit.rest.repos.listForUser({
      username: user.login,
      sort: "updated",
      per_page: 10,
    });

    return {
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
      },
      repositories: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics,
      })),
    };
  } catch (error) {
    console.error("GitHub API error:", error);
    throw new Error("Failed to fetch GitHub profile");
  }
}
