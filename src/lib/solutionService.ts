// Dynamic Solution Loader (Lazy Evaluation Chunk)
// NOTE: On static client-side sites (GitHub Pages), client JavaScript runs entirely in the user's browser.
// Lazy-loading solutionSql via dynamic imports keeps solutions out of the main initial JavaScript bundle,
// reducing initial load time and preventing casual bundle inspection.
// True tamper-proof protection requires a backend execution server.

type SolutionMap = Record<string, string>;

// Solution chunks per category / module
const solutionsCache: Map<string, string> = new Map();

export async function fetchChallengeSolution(challengeId: string): Promise<string> {
  if (solutionsCache.has(challengeId)) {
    return solutionsCache.get(challengeId)!;
  }

  // Dynamically import solutions registry on demand
  const registry = await import('../data/solutionsRegistry');
  const solution = registry.SOLUTIONS_MAP[challengeId] || registry.SOLUTIONS_MAP['default'] || 'SELECT * FROM table;';

  solutionsCache.set(challengeId, solution);
  return solution;
}
