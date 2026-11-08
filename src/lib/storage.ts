// Centralized, Versioned, and Crash-Proof Storage Manager with Migration & Export/Import
import { CourseProgress, Topic, TopicStep } from '../types';
import { validateAndSanitizeCurriculum } from './curriculumValidator';

const STORAGE_VERSION = 3;
const PREFIX = 'sqlmastery_v3_';

// Modern Keys
const KEYS = {
  VERSION: `${PREFIX}storage_version`,
  PROGRESS: `${PREFIX}progress`,
  ALL_TOPICS: `${PREFIX}all_topics`,
  AUTH: 'sqlmastery_auth_user_v1', // Out of scope as per instructions
};

// Legacy Keys for Migration
const LEGACY_KEYS = {
  PROGRESS_V2: 'sqlmastery_course_progress_v2',
  TOPICS_V2: 'sqlmastery_all_topics_v2',
  CUSTOM_TOPICS_V1: 'sqlmastery_custom_topics_v1',
};

// Defensive JSON reader with default fallback
function safeRead<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[SafeStorage] Corrupt localStorage entry for key "${key}". Returning default fallback.`, err);
    return fallback;
  }
}

// Defensive JSON writer with QuotaExceeded handling
function safeWrite<T>(key: string, data: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err: any) {
    console.error(`[SafeStorage] Failed to write key "${key}":`, err);
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      alert('Browser storage quota exceeded. Consider exporting your course data and clearing old cache.');
    }
    return false;
  }
}

// Automatic one-time migration from legacy storage keys
function runOneTimeMigration() {
  try {
    if (typeof window === 'undefined') return;
    const currentVersion = safeRead<number>(KEYS.VERSION, 0);

    if (currentVersion < STORAGE_VERSION) {
      // 1. Migrate Progress
      const legacyProg = localStorage.getItem(LEGACY_KEYS.PROGRESS_V2);
      if (legacyProg && !localStorage.getItem(KEYS.PROGRESS)) {
        try {
          const parsed = JSON.parse(legacyProg);
          if (parsed && parsed.topics) {
            safeWrite(KEYS.PROGRESS, parsed);
          }
        } catch {}
      }

      // 2. Migrate Topics
      const legacyTopics = localStorage.getItem(LEGACY_KEYS.TOPICS_V2);
      if (legacyTopics && !localStorage.getItem(KEYS.ALL_TOPICS)) {
        try {
          const parsed = JSON.parse(legacyTopics);
          if (Array.isArray(parsed) && parsed.length > 0) {
            safeWrite(KEYS.ALL_TOPICS, parsed);
          }
        } catch {}
      }

      // Mark migration version
      safeWrite(KEYS.VERSION, STORAGE_VERSION);
    }
  } catch (err) {
    console.error('[SafeStorage] Migration error:', err);
  }
}

// Run migration on script initialization
if (typeof window !== 'undefined') {
  runOneTimeMigration();
}

// Progress Management
export function getInitialProgress(topics: Topic[]): CourseProgress {
  const defaultProgress: CourseProgress = {
    currentTopicId: topics[0]?.id || 'topic-1-select',
    topics: {},
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };

  (topics || []).forEach((t) => {
    if (!t || !t.id) return;
    defaultProgress.topics[t.id] = {
      videoWatched: false,
      theoryRead: false,
      quizPassed: false,
      quizScore: 0,
      codingCompleted: false,
      userSql: '', // ALWAYS empty
    };
  });

  return defaultProgress;
}

export function loadProgress(topics: Topic[]): CourseProgress {
  const raw = safeRead<CourseProgress | null>(KEYS.PROGRESS, null);
  if (!raw || !raw.topics || typeof raw.topics !== 'object') {
    // Check legacy key if exists
    const legacy = safeRead<CourseProgress | null>(LEGACY_KEYS.PROGRESS_V2, null);
    if (legacy && legacy.topics) {
      safeWrite(KEYS.PROGRESS, legacy);
      return legacy;
    }
    return getInitialProgress(topics);
  }

  // Ensure all topics exist in progress map
  (topics || []).forEach((t) => {
    if (!t || !t.id) return;
    if (!raw.topics[t.id]) {
      raw.topics[t.id] = {
        videoWatched: false,
        theoryRead: false,
        quizPassed: false,
        quizScore: 0,
        codingCompleted: false,
        userSql: '',
      };
    }
  });

  if (!raw.currentTopicId || !topics.some((t) => t.id === raw.currentTopicId)) {
    raw.currentTopicId = topics[0]?.id || 'topic-1-select';
  }

  return raw;
}

export function saveProgress(progress: CourseProgress): void {
  safeWrite(KEYS.PROGRESS, progress);
  // Synchronize legacy key for backward-compatibility with older browser tabs
  safeWrite(LEGACY_KEYS.PROGRESS_V2, progress);
}

// Gating Logic
export function isTopicUnlocked(topicIndex: number, allTopics: Topic[], progress: CourseProgress): boolean {
  if (topicIndex === 0) return true;
  const previousTopic = allTopics[topicIndex - 1];
  if (!previousTopic) return true;
  const prevProg = progress?.topics?.[previousTopic.id];
  return Boolean(prevProg?.codingCompleted);
}

export function isStepUnlocked(
  topicId: string,
  step: TopicStep,
  progress: CourseProgress
): boolean {
  const p = progress?.topics?.[topicId];
  if (!p) return step === 'video';

  switch (step) {
    case 'video':
      return true;
    case 'theory':
      return Boolean(p.videoWatched);
    case 'quiz':
      return Boolean(p.videoWatched && p.theoryRead);
    case 'coding':
      return Boolean(p.videoWatched && p.theoryRead && p.quizPassed);
    default:
      return true;
  }
}

// Topics Management
export function loadAllTopics(defaultTopics: Topic[]): Topic[] {
  const raw = safeRead<Topic[] | null>(KEYS.ALL_TOPICS, null);
  if (raw && Array.isArray(raw) && raw.length > 0) {
    return raw.filter((t) => t && t.id && t.title);
  }

  const legacy = safeRead<Topic[] | null>(LEGACY_KEYS.TOPICS_V2, null);
  if (legacy && Array.isArray(legacy) && legacy.length > 0) {
    safeWrite(KEYS.ALL_TOPICS, legacy);
    return legacy.filter((t) => t && t.id && t.title);
  }

  return defaultTopics;
}

export function saveAllTopics(topics: Topic[]): void {
  safeWrite(KEYS.ALL_TOPICS, topics);
  safeWrite(LEGACY_KEYS.TOPICS_V2, topics);
}

// Data Backup: Export all student data as JSON
export function exportUserData(): string {
  const backup = {
    exportedAt: new Date().toISOString(),
    schemaVersion: STORAGE_VERSION,
    progress: safeRead(KEYS.PROGRESS, null),
    allTopics: safeRead(KEYS.ALL_TOPICS, null),
  };
  return JSON.stringify(backup, null, 2);
}

// Data Restore: Import user backup JSON
export function importUserData(jsonText: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file.' };
    }

    if (parsed.progress) {
      safeWrite(KEYS.PROGRESS, parsed.progress);
    }

    if (parsed.allTopics && Array.isArray(parsed.allTopics)) {
      const val = validateAndSanitizeCurriculum(parsed.allTopics);
      if (val.valid && val.sanitizedTopics) {
        safeWrite(KEYS.ALL_TOPICS, val.sanitizedTopics);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to import backup.' };
  }
}
