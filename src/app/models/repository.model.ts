// Definisco la struttura di un repository GitHub.
export type Repository = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
};

// Definisco la struttura della risposta restituita dalla GitHub Search API.
export type RepositorySearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
};
