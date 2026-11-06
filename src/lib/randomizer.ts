/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

/**
 * 1. Shuffles the 20 quiz questions and returns exactly 10.
 */
export function getRandomQuizQuestions<T>(quizBank: T[], count = 10): T[] {
  if (!Array.isArray(quizBank) || quizBank.length === 0) return [];
  if (quizBank.length <= count) return quizBank;
  return shuffleArray(quizBank).slice(0, count);
}

/**
 * 2. Shuffles the 5 coding challenges and returns exactly 1.
 */
export function getRandomCodingChallenge<T>(codingBank: T[]): T | null {
  if (!Array.isArray(codingBank) || codingBank.length === 0) return null;
  const shuffled = shuffleArray(codingBank);
  return shuffled[0];
}

/**
 * 3. Checks if the user's quiz score is 70% or higher to unlock Step 4 (Coding Test).
 */
export function checkQuizPassingScore(correctCount: number, totalQuestions = 10): boolean {
  if (totalQuestions <= 0) return false;
  const percentage = (correctCount / totalQuestions) * 100;
  return percentage >= 70;
}
