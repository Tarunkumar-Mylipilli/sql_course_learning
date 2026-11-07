import { CourseProgress, Topic, TopicStep } from '../types';

const STORAGE_KEY = 'sqlmastery_course_progress_v2';
const ALL_TOPICS_KEY = 'sqlmastery_all_topics_v2';
const CUSTOM_TOPICS_KEY = 'sqlmastery_custom_topics_v1';

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
      userSql: '', // ALWAYS empty so answers are never revealed!
    };
  });

  return defaultProgress;
}

export function loadProgress(topics: Topic[]): CourseProgress {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return getInitialProgress(topics);

    const parsed = JSON.parse(raw) as CourseProgress;
    if (!parsed || typeof parsed !== 'object' || !parsed.topics || typeof parsed.topics !== 'object') {
      return getInitialProgress(topics);
    }

    // Ensure all current topics exist in progress map
    (topics || []).forEach((t) => {
      if (!t || !t.id) return;
      if (!parsed.topics[t.id]) {
        parsed.topics[t.id] = {
          videoWatched: false,
          theoryRead: false,
          quizPassed: false,
          quizScore: 0,
          codingCompleted: false,
          userSql: '',
        };
      }
    });

    // Validate currentTopicId exists, or fallback
    if (!parsed.currentTopicId || !topics.some((t) => t.id === parsed.currentTopicId)) {
      parsed.currentTopicId = topics[0]?.id || 'topic-1-select';
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
    return getInitialProgress(topics);
  }
}

export function saveProgress(progress: CourseProgress): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

// Check if a topic itself is unlocked (Topic 1 is always unlocked; subsequent topics require previous coding complete)
export function isTopicUnlocked(topicIndex: number, allTopics: Topic[], progress: CourseProgress): boolean {
  if (topicIndex === 0) return true;
  const previousTopic = allTopics[topicIndex - 1];
  if (!previousTopic) return true;
  const prevProg = progress?.topics?.[previousTopic.id];
  return Boolean(prevProg?.codingCompleted);
}

// Strict step gating:
// 1. Video (Always accessible if topic unlocked)
// 2. Theory (Unlocked after video watched)
// 3. Quiz (Unlocked after theory read)
// 4. Coding (ONLY UNLOCKED IF QUIZ IS PASSED WITH >= 75%)
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

// Load topics with localStorage overrides for user edits/additions/deletions
export function loadAllTopics(defaultTopics: Topic[]): Topic[] {
  try {
    if (typeof window === 'undefined') return defaultTopics;
    const raw = localStorage.getItem(ALL_TOPICS_KEY);
    if (!raw) return defaultTopics;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultTopics;
    return parsed.filter((t) => t && t.id && t.title);
  } catch (err) {
    console.error('Failed to load all topics from localStorage:', err);
    return defaultTopics;
  }
}

export function saveAllTopics(topics: Topic[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ALL_TOPICS_KEY, JSON.stringify(topics));
    }
  } catch (err) {
    console.error('Failed to save all topics to localStorage:', err);
  }
}

// Legacy custom topics support
export function loadCustomTopics(): Topic[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(CUSTOM_TOPICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => t && t.id && t.title);
  } catch (err) {
    console.error('Failed to load custom topics:', err);
    return [];
  }
}

export function saveCustomTopics(topics: Topic[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(topics));
    }
  } catch (err) {
    console.error('Failed to save custom topics:', err);
  }
}
