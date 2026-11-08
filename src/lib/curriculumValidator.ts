import { z } from 'zod';
import DOMPurify from 'dompurify';

// Sanitize single text field: strip all dangerous tags & malicious event handlers
export function sanitizeText(val: unknown): string {
  if (typeof val !== 'string') return '';
  // Sanitize with strict text/formatting allowlist
  return DOMPurify.sanitize(val, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'span'],
    ALLOWED_ATTR: ['class'],
  }).trim();
}

// Deep sanitize an object recursively
export function deepSanitize<T>(input: T): T {
  if (typeof input === 'string') {
    return sanitizeText(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => deepSanitize(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(input)) {
      sanitizedObj[key] = deepSanitize(val);
    }
    return sanitizedObj as T;
  }
  return input;
}

// SubModule Schema
export const SubModuleSchema = z.object({
  id: z.string().max(100),
  order: z.number().int().nonnegative(),
  title: z.string().min(1).max(250),
  duration: z.string().max(50).optional(),
  summary: z.string().max(1000).optional(),
  notes: z.string().max(20000).optional(),
  videoUrl: z.string().url().max(500).optional().or(z.literal('')),
});

// SchemaTableColumn Schema
export const SchemaTableColumnSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  isPk: z.boolean().optional(),
  isFk: z.boolean().optional(),
});

// SchemaTable Schema
export const SchemaTableSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  columns: z.array(SchemaTableColumnSchema).max(50),
  sampleData: z.array(z.record(z.string(), z.any())).max(100).optional().default([]),
});

// CodingChallenge Schema
export const CodingChallengeSchema = z.object({
  id: z.string().max(100),
  title: z.string().min(1).max(250),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  source: z.enum(['LeetCode', 'DataLemur', 'W3Resource', 'Standard', 'FAANG']).optional(),
  sourceId: z.string().max(100).optional(),
  instructions: z.string().min(1).max(5000),
  schemaSql: z.string().max(50000),
  tables: z.array(SchemaTableSchema).max(20),
  starterSql: z.string().max(10000).default(''),
  solutionSql: z.string().max(10000),
  expectedColumns: z.array(z.string().max(100)).max(50).optional(),
  expectedOutputData: z.array(z.record(z.string(), z.any())).max(500).optional(),
  hints: z.array(z.string().max(1000)).max(20).default([]),
});

// TopicVideo Schema
export const TopicVideoSchema = z.object({
  title: z.string().min(1).max(250),
  embedUrl: z.string().max(500),
  duration: z.string().max(50),
  channel: z.string().max(150),
  language: z.string().max(50).optional(),
  summaryPoints: z.array(z.string().max(500)).max(20).default([]),
});

// QuizQuestion Schema
export const QuizQuestionSchema = z.object({
  id: z.string().max(100),
  question: z.string().min(1).max(1000),
  codeSnippet: z.string().max(5000).optional(),
  options: z.array(z.string().max(500)).min(2).max(10),
  correctIndex: z.number().int().min(0).max(9),
  explanation: z.string().max(2000),
});

// TopicTheory Schema
export const TopicTheorySchema = z.object({
  title: z.string().min(1).max(250),
  summary: z.string().max(2000),
  syntax: z.string().max(10000),
  explanation: z.array(z.string().max(5000)).max(50),
  keyRules: z.array(z.string().max(2000)).max(50),
  commonMistakes: z.array(z.string().max(2000)).max(50),
  exampleQuery: z.string().max(10000),
  exampleExplanation: z.string().max(5000),
  mermaidMindmap: z.string().max(10000).optional(),
});

// Full Topic Schema
export const TopicSchema = z.object({
  id: z.string().min(1).max(100),
  order: z.number().int().nonnegative(),
  slug: z.string().max(100),
  title: z.string().min(1).max(250),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedMinutes: z.number().int().min(1).max(300),
  badge: z.string().max(50),
  overview: z.string().max(2000),
  learningObjectives: z.array(z.string().max(500)).max(30).optional(),
  subModules: z.array(SubModuleSchema).max(50).optional(),
  video: TopicVideoSchema,
  alternativeVideos: z.array(TopicVideoSchema).max(10).optional(),
  addonVideos: z.array(TopicVideoSchema).max(10).optional(),
  theory: TopicTheorySchema,
  quiz: z.object({
    passingScorePercent: z.number().min(0).max(100),
    questions: z.array(QuizQuestionSchema).min(1).max(50),
  }),
  challenge: CodingChallengeSchema,
  challenges: z.array(CodingChallengeSchema).max(50).optional(),
});

// Curriculum Export Envelope
export const CurriculumExportEnvelopeSchema = z.object({
  version: z.number().int().default(1),
  exportedAt: z.string(),
  exportedBy: z.string().optional(),
  topics: z.array(TopicSchema).min(1).max(100),
});

export type ValidatedTopic = z.infer<typeof TopicSchema>;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedTopics?: ValidatedTopic[];
}

// Validate and sanitize imported curriculum JSON
export function validateAndSanitizeCurriculum(jsonRaw: unknown): ValidationResult {
  try {
    // Check if imported file is wrapped in an envelope or raw array
    let rawTopics: any[] = [];
    if (Array.isArray(jsonRaw)) {
      rawTopics = jsonRaw;
    } else if (typeof jsonRaw === 'object' && jsonRaw !== null && 'topics' in jsonRaw) {
      rawTopics = (jsonRaw as any).topics;
    } else {
      return {
        valid: false,
        errors: ['Imported file is neither a JSON array of modules nor a standard curriculum envelope object.'],
      };
    }

    if (!Array.isArray(rawTopics) || rawTopics.length === 0) {
      return {
        valid: false,
        errors: ['Curriculum must contain at least 1 module.'],
      };
    }

    // Schema validation via Zod
    const topicsArraySchema = z.array(TopicSchema);
    const parseResult = topicsArraySchema.safeParse(rawTopics);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.issues.map(
        (issue) => `[${issue.path.join('.') || 'root'}]: ${issue.message}`
      );
      return {
        valid: false,
        errors: formattedErrors.slice(0, 15), // top 15 detailed errors
      };
    }

    // Strict recursive sanitization across all fields
    const sanitizedTopics = deepSanitize(parseResult.data);

    return {
      valid: true,
      errors: [],
      sanitizedTopics,
    };
  } catch (err: any) {
    return {
      valid: false,
      errors: [err?.message || 'Failed to parse JSON file'],
    };
  }
}
