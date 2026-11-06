export type TopicStep = 'video' | 'theory' | 'quiz' | 'coding';

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SchemaTableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

export interface SchemaTable {
  name: string;
  description?: string;
  columns: SchemaTableColumn[];
  sampleData: Record<string, any>[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source?: 'LeetCode' | 'DataLemur' | 'W3Resource' | 'Standard' | 'FAANG';
  sourceId?: string; // e.g. "LeetCode 570" or "DataLemur (Uber)"
  instructions: string;
  schemaSql: string;
  tables: SchemaTable[];
  starterSql: string;
  solutionSql: string;
  expectedColumns?: string[];
  hints: string[];
}

export interface TopicTheory {
  title: string;
  summary: string;
  syntax: string;
  explanation: string[];
  keyRules: string[];
  commonMistakes: string[];
  exampleQuery: string;
  exampleExplanation: string;
}

export interface TopicVideo {
  title: string;
  embedUrl: string; // YouTube embed link
  duration: string;
  channel: string;
  language?: string; // e.g. 'English' | 'Telugu'
  summaryPoints: string[];
}

export interface Topic {
  id: string;
  order: number;
  slug: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  badge: string;
  overview: string;
  video: TopicVideo;
  alternativeVideos?: TopicVideo[]; // Allows switching between preferred creators & Telugu
  theory: TopicTheory;
  quiz: {
    passingScorePercent: number; // e.g. 75
    questions: QuizQuestion[];
  };
  challenge: CodingChallenge; // Primary challenge
  challenges?: CodingChallenge[]; // Extended practice bank (W3Resource, LeetCode, DataLemur)
}

export interface TopicProgress {
  videoWatched: boolean;
  theoryRead: boolean;
  quizPassed: boolean;
  quizScore: number; // percentage
  codingCompleted: boolean;
  solvedChallengeIds?: string[];
  userSql?: string;
}

export interface CourseProgress {
  currentTopicId: string;
  topics: Record<string, TopicProgress>;
  streakDays: number;
  lastActiveDate: string;
}
