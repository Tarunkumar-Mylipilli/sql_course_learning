import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Clock,
  Code2,
  Check,
  Building2,
  X,
  ExternalLink,
  BookOpen,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PracticeDatabaseType,
  W3RESOURCE_SCHEMAS,
  W3RESOURCE_SEED_SQL,
} from '../data/modules/sqlPracticeData';
import { UNIFIED_PRACTICE_QUESTIONS, PracticeProblem } from '../data/modules/unifiedPracticeQuestions';
import { executeQuery, validateSolution, QueryResult, ValidationResult } from '../lib/sqlEngine';

interface SqlPracticeArenaProps {
  onOpenAITutorWithContext: (context: {
    topicTitle: string;
    instructions: string;
    schemaSql: string;
    userSql: string;
    errorMessage?: string;
  }) => void;
  initialDb?: PracticeDatabaseType;
}

const STORAGE_KEY_COMPLETED = 'sqlmastery_practice_completed_ids_v2';

// Company logo / badge helper
const renderCompanyBadge = (company: string) => {
  const c = company.toLowerCase();
  if (c.includes('twitter')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-sky-500">
        <span className="w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center text-xs">🐦</span>
        <span>Twitter</span>
      </span>
    );
  }
  if (c.includes('linkedin')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600">
        <span className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-xs font-bold font-mono">in</span>
        <span>LinkedIn</span>
      </span>
    );
  }
  if (c.includes('facebook') || c.includes('meta')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-blue-500">
        <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-bold font-mono">f</span>
        <span>Facebook</span>
      </span>
    );
  }
  if (c.includes('tesla')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-red-500">
        <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-xs font-bold font-mono">T</span>
        <span>Tesla</span>
      </span>
    );
  }
  if (c.includes('nytimes') || c.includes('ny times')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-content-primary">
        <span className="w-5 h-5 rounded-full bg-surface-muted flex items-center justify-center text-xs font-serif font-bold">T</span>
        <span>NY Times</span>
      </span>
    );
  }
  if (c.includes('microsoft')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-indigo-400">
        <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs">⊞</span>
        <span>Microsoft</span>
      </span>
    );
  }
  if (c.includes('amazon')) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-500">
        <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold">a</span>
        <span>Amazon</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-content-secondary">
      <span className="w-5 h-5 rounded-full bg-surface-muted flex items-center justify-center text-xs">📚</span>
      <span>{company}</span>
    </span>
  );
};

export const SqlPracticeArena: React.FC<SqlPracticeArenaProps> = ({
  onOpenAITutorWithContext,
}) => {
  // Navigation: false = Catalog Table View (Screen 1), true = Solving Arena (Screen 2)
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(UNIFIED_PRACTICE_QUESTIONS[0].id);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Solved state
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Solver UI state
  const [activeTab, setActiveTab] = useState<'question' | 'solution' | 'hints'>('question');
  const [userSql, setUserSql] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isSolving && isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSolving, isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find active question
  const currentQuestion: PracticeProblem = useMemo(() => {
    return (
      UNIFIED_PRACTICE_QUESTIONS.find((q) => q.id === activeQuestionId) ||
      UNIFIED_PRACTICE_QUESTIONS[0]
    );
  }, [activeQuestionId]);

  // Clean editor on question change
  useEffect(() => {
    setUserSql('');
    setQueryResult(null);
    setValidationResult(null);
    setElapsedSeconds(0);
    setActiveTab('question');
  }, [currentQuestion.id]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    UNIFIED_PRACTICE_QUESTIONS.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return Array.from(set);
  }, []);

  // Compute tag frequencies
  const tagsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    UNIFIED_PRACTICE_QUESTIONS.forEach((q) => {
      q.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Filtered Questions List for Catalog Table
  const filteredQuestions = useMemo(() => {
    return UNIFIED_PRACTICE_QUESTIONS.filter((q) => {
      if (filterDifficulty !== 'all' && q.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()) {
        return false;
      }
      if (filterCategory !== 'all' && q.category.toLowerCase() !== filterCategory.toLowerCase()) {
        return false;
      }
      if (selectedTag && !q.tags.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchCompany = q.company.toLowerCase().includes(query);
        const matchDesc = q.description.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query);
        const matchTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchCompany && !matchDesc && !matchCat && !matchTags) return false;
      }
      return true;
    });
  }, [filterDifficulty, filterCategory, selectedTag, searchQuery]);

  // Progress metrics
  const totalEasy = UNIFIED_PRACTICE_QUESTIONS.filter((q) => q.difficulty === 'Easy').length;
  const solvedEasy = UNIFIED_PRACTICE_QUESTIONS.filter(
    (q) => q.difficulty === 'Easy' && completedIds.includes(q.id)
  ).length;

  const totalMed = UNIFIED_PRACTICE_QUESTIONS.filter((q) => q.difficulty === 'Medium').length;
  const solvedMed = UNIFIED_PRACTICE_QUESTIONS.filter(
    (q) => q.difficulty === 'Medium' && completedIds.includes(q.id)
  ).length;

  const totalHard = UNIFIED_PRACTICE_QUESTIONS.filter((q) => q.difficulty === 'Hard').length;
  const solvedHard = UNIFIED_PRACTICE_QUESTIONS.filter(
    (q) => q.difficulty === 'Hard' && completedIds.includes(q.id)
  ).length;

  const totalSolved = completedIds.length;
  const totalCount = UNIFIED_PRACTICE_QUESTIONS.length;
  const percentComplete = Math.round((totalSolved / totalCount) * 100) || 0;

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterDifficulty('all');
    setSelectedTag(null);
  };

  // Build schema & seed for current question
  const currentSeedSql = useMemo(() => {
    if (currentQuestion.schemaSql && currentQuestion.schemaSql.trim()) {
      return currentQuestion.schemaSql;
    }
    return W3RESOURCE_SEED_SQL;
  }, [currentQuestion]);

  // Dynamic tables list for problem description
  const problemTables = useMemo(() => {
    if (currentQuestion.tables && currentQuestion.tables.length > 0) {
      return currentQuestion.tables;
    }
    // Fallback: match tables from W3RESOURCE_SCHEMAS mentioned in question
    const descLower = currentQuestion.description.toLowerCase();
    const solLower = currentQuestion.solutionSql.toLowerCase();
    const matched = W3RESOURCE_SCHEMAS.filter(
      (s) => descLower.includes(s.tableName) || solLower.includes(s.tableName)
    );
    const targetSchemas = matched.length > 0 ? matched : [W3RESOURCE_SCHEMAS[0]];

    return targetSchemas.map((s) => ({
      name: s.tableName,
      columns: s.columns.map((c) => ({ name: c.name, type: c.type.toLowerCase(), isPk: c.isPk })),
      sampleData: [],
    }));
  }, [currentQuestion]);

  // Execute query handler
  const handleRunCode = async () => {
    if (!userSql.trim() || isRunning) return;
    setIsRunning(true);
    setValidationResult(null);

    const res = await executeQuery(currentSeedSql, userSql);
    setQueryResult(res);
    setIsRunning(false);
  };

  // Validate solution handler
  const handleSubmitSolution = async () => {
    if (!userSql.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const val = await validateSolution(currentSeedSql, userSql, currentQuestion.solutionSql);
    setValidationResult(val);
    setQueryResult(val.userResult || null);
    setIsSubmitting(false);

    if (val.passed) {
      if (!completedIds.includes(currentQuestion.id)) {
        const updated = [...completedIds, currentQuestion.id];
        setCompletedIds(updated);
        try {
          localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  // Navigate question indices
  const currentIndex = UNIFIED_PRACTICE_QUESTIONS.findIndex((q) => q.id === currentQuestion.id);
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setActiveQuestionId(UNIFIED_PRACTICE_QUESTIONS[currentIndex - 1].id);
    }
  };
  const handleNextQuestion = () => {
    if (currentIndex < UNIFIED_PRACTICE_QUESTIONS.length - 1) {
      setActiveQuestionId(UNIFIED_PRACTICE_QUESTIONS[currentIndex + 1].id);
    }
  };

  const sqlLines = userSql.split('\n');

  // =========================================================================
  // SCREEN 1: QUESTION CATALOG & PROGRESS VIEW (Matches Reference Screenshot 1)
  // =========================================================================
  if (!isSolving) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-content-primary p-4 sm:p-6 lg:p-8 font-ui">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
              SQL & Data Interview Questions
            </h1>
            <p className="mt-1 text-sm text-content-secondary">
              Practice the most common SQL, Statistics, ML, and Python questions asked in FAANG Data Science & Data Analyst interviews!
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-content-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions/companies"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border-default text-xs text-content-primary placeholder:text-content-subtle focus:outline-none focus:border-accent-500 transition shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-surface text-content-primary text-xs font-medium border border-border-default rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="all">Category ⌄</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-surface text-content-primary text-xs font-medium border border-border-default rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="all">Difficulty ⌄</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Clear filters button */}
            {(searchQuery || filterCategory !== 'all' || filterDifficulty !== 'all' || selectedTag) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface/80 border border-border-default transition cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Active Tag Pill */}
          {selectedTag && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-content-subtle">Filtered by tag:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 font-semibold border border-accent-500/30">
                <span>{selectedTag}</span>
                <button onClick={() => setSelectedTag(null)} className="hover:text-accent-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* 2-Column Catalog Grid: Table (Left 75%) + Sidebar (Right 25%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Clean DataLemur Questions Table */}
            <div className="lg:col-span-8 bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-canvas/40 border-b border-border-default text-content-secondary font-bold select-none">
                    <tr>
                      <th className="py-3 px-4 w-36">Company</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4 w-28">Category</th>
                      <th className="py-3 px-4 w-24">Difficulty</th>
                      <th className="py-3 px-4 w-20 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-sans">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-content-subtle">
                          No interview questions match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => {
                        const isDone = completedIds.includes(q.id);
                        return (
                          <tr
                            key={q.id}
                            onClick={() => {
                              setActiveQuestionId(q.id);
                              setIsSolving(true);
                            }}
                            className="hover:bg-surface-muted/40 transition cursor-pointer group"
                          >
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {renderCompanyBadge(q.company)}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-content-primary group-hover:text-accent-500 transition">
                              {q.title}
                            </td>
                            <td className="py-3.5 px-4 text-content-secondary whitespace-nowrap">
                              {q.category}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`text-[11px] font-semibold ${
                                  q.difficulty === 'Easy'
                                    ? 'text-emerald-500'
                                    : q.difficulty === 'Medium'
                                    ? 'text-amber-500'
                                    : 'text-rose-500'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              {isDone ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="text-content-subtle font-mono text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SIDEBAR: Your Progress + Tags */}
            <div className="lg:col-span-4 space-y-6">
              {/* Your Progress Card */}
              <div className="bg-surface border border-border-default rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-content-primary">Your Progress</h3>

                <div className="flex items-center justify-around gap-4 pt-1">
                  {/* Radial Progress Ring */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-border-subtle"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-700 ease-out"
                        strokeDasharray={`${percentComplete}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-lg font-black tracking-tight text-content-primary">
                        {percentComplete}%
                      </span>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-content-secondary">Easy</span>
                      <span className="font-mono font-bold text-content-primary ml-auto pl-2">
                        {solvedEasy}/{totalEasy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-content-secondary">Medium</span>
                      <span className="font-mono font-bold text-content-primary ml-auto pl-2">
                        {solvedMed}/{totalMed}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-content-secondary">Hard</span>
                      <span className="font-mono font-bold text-content-primary ml-auto pl-2">
                        {solvedHard}/{totalHard}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Cloud Card */}
              <div className="bg-surface border border-border-default rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-content-primary">Tags</h3>
                <div className="flex flex-wrap gap-1.5 max-h-80 overflow-y-auto pr-1">
                  {tagsWithCounts.map(({ tag, count }) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(isSelected ? null : tag)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-accent-500/15 border-accent-500 text-accent-400 font-bold'
                            : 'bg-surface border-border-default text-content-secondary hover:text-content-primary hover:border-border-hover'
                        }`}
                      >
                        <span>{tag}</span>
                        <span className="text-[10px] text-content-subtle font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: SOLVING ARENA (Matches Reference Screenshot 2)
  // =========================================================================
  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-content-primary p-4 sm:p-6 lg:p-8 font-ui">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* TOP BAR: Back Button + Timer + Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSolving(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-default hover:border-accent-500 text-xs font-semibold text-content-primary transition cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All questions</span>
            </button>

            {/* Question switcher arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-md bg-surface border border-border-default text-content-secondary hover:text-content-primary disabled:opacity-40 cursor-pointer"
                title="Previous question"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentIndex === UNIFIED_PRACTICE_QUESTIONS.length - 1}
                className="p-1.5 rounded-md bg-surface border border-border-default text-content-secondary hover:text-content-primary disabled:opacity-40 cursor-pointer"
                title="Next question"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-content-subtle ml-1">
                {currentIndex + 1} / {UNIFIED_PRACTICE_QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Right Toolbar: Live Clock & AI Tutor */}
          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-default text-xs font-mono text-content-primary">
              <Clock className="w-3.5 h-3.5 text-accent-500" />
              <span>{formatTimer(elapsedSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className="text-[10px] text-content-subtle hover:text-content-primary ml-1"
              >
                {isTimerRunning ? '⏸' : '▶'}
              </button>
            </div>

            <button
              onClick={() =>
                onOpenAITutorWithContext({
                  topicTitle: currentQuestion.title,
                  instructions: currentQuestion.description,
                  schemaSql: currentSeedSql,
                  userSql,
                  errorMessage: queryResult?.error || validationResult?.message,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-default hover:border-accent-500 text-xs font-semibold text-content-primary transition cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>Ask AI Tutor 🪄</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN SPLIT SOLVER WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Problem Statement & Interactive Tables */}
          <div className="lg:col-span-6 space-y-4">
            {/* Question Title & Meta Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-content-primary">
                {currentQuestion.title}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="text-content-secondary font-medium">
                  {currentQuestion.company} SQL Interview Question
                </span>
                <span className="text-content-subtle">•</span>
                <span className="text-content-subtle">Sourced from</span>
                {renderCompanyBadge(currentQuestion.company)}
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : currentQuestion.difficulty === 'Medium'
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-rose-500 bg-rose-500/10'
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Navigation Tabs: Question | Solution | Discussion / Hints */}
            <div className="flex items-center gap-1 border-b border-border-default text-xs font-semibold">
              <button
                onClick={() => setActiveTab('question')}
                className={`py-2 px-3 border-b-2 transition cursor-pointer ${
                  activeTab === 'question'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                Question
              </button>
              <button
                onClick={() => setActiveTab('solution')}
                className={`py-2 px-3 border-b-2 transition cursor-pointer ${
                  activeTab === 'solution'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                Solution
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`py-2 px-3 border-b-2 transition cursor-pointer ${
                  activeTab === 'hints'
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                Discussion & Hints
              </button>
            </div>

            {/* Tab 1: Question Description & Table Schemas */}
            {activeTab === 'question' && (
              <div className="space-y-5 text-xs sm:text-sm text-content-secondary leading-relaxed font-sans max-h-[calc(100vh-270px)] overflow-y-auto pr-2">
                <p className="whitespace-pre-line text-content-primary">
                  {currentQuestion.description}
                </p>

                {/* Table Schemas & Example Input matching Screenshot 2 */}
                {problemTables.map((tbl) => (
                  <div key={tbl.name} className="space-y-3 pt-2">
                    {/* Schema Table Header */}
                    <div className="space-y-1.5">
                      <h4 className="font-mono font-bold text-xs text-content-primary">
                        <code>{tbl.name}</code> Table:
                      </h4>
                      <div className="border border-border-default rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-canvas/50 border-b border-border-default text-content-secondary font-bold">
                            <tr>
                              <th className="py-2 px-3.5 font-mono">Column Name</th>
                              <th className="py-2 px-3.5 font-mono">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle font-mono text-[11px] text-content-primary">
                            {tbl.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-surface-muted/30">
                                <td className="py-2 px-3.5 flex items-center gap-1.5">
                                  <span>{col.name}</span>
                                  {col.isPk && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                      PK
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3.5 text-content-secondary">{col.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Example Input Table */}
                    {tbl.sampleData && tbl.sampleData.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <h4 className="font-mono font-bold text-xs text-content-primary">
                          <code>{tbl.name}</code> Example Input:
                        </h4>
                        <div className="border border-border-default rounded-xl overflow-x-auto shadow-sm">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-canvas/50 border-b border-border-default text-content-secondary font-bold">
                              <tr>
                                {Object.keys(tbl.sampleData[0]).map((k) => (
                                  <th key={k} className="py-2 px-3.5 font-mono text-[11px]">
                                    {k}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle font-mono text-[11px] text-content-primary">
                              {tbl.sampleData.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-surface-muted/30">
                                  {Object.values(row).map((val: any, cIdx) => (
                                    <td key={cIdx} className="py-2 px-3.5 whitespace-nowrap">
                                      {val === null ? (
                                        <span className="text-content-subtle italic">NULL</span>
                                      ) : (
                                        String(val)
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Reference Solution */}
            {activeTab === 'solution' && (
              <div className="space-y-4 max-h-[calc(100vh-270px)] overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-content-primary">Official Canonical Solution</h4>
                  <button
                    onClick={() => setUserSql(currentQuestion.solutionSql)}
                    className="text-xs font-semibold text-accent-500 hover:underline cursor-pointer"
                  >
                    Copy to Code Editor
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-canvas border border-border-default text-xs font-mono text-content-primary overflow-x-auto leading-relaxed">
                  {currentQuestion.solutionSql}
                </pre>
              </div>
            )}

            {/* Tab 3: Hints & Discussion */}
            {activeTab === 'hints' && (
              <div className="space-y-4 max-h-[calc(100vh-270px)] overflow-y-auto pr-2 text-xs">
                <div className="bg-surface/80 border border-border-default rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-content-primary">Guiding Hints</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-content-secondary leading-relaxed">
                    {currentQuestion.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-border-default text-center space-y-2">
                  <p className="text-content-subtle">
                    Need personalized step-by-step guidance without seeing the full answer?
                  </p>
                  <button
                    onClick={() =>
                      onOpenAITutorWithContext({
                        topicTitle: currentQuestion.title,
                        instructions: currentQuestion.description,
                        schemaSql: currentSeedSql,
                        userSql,
                        errorMessage: queryResult?.error || validationResult?.message,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold cursor-pointer shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chat with AI Tutor</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive SQL Playground & Output */}
          <div className="lg:col-span-6 space-y-4">
            {/* Playground Header */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-content-secondary">Input:</span>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border-default text-content-primary">
                  PostgreSQL 14 / SQLite 3.45 ⌄
                </span>
              </div>
              <button
                onClick={() => setUserSql('')}
                className="text-xs text-content-subtle hover:text-content-primary transition cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Clean Line-Numbered SQL Editor (Starts Blank!) */}
            <div className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
              <div className="relative font-mono text-xs flex min-h-[220px]">
                {/* Line numbers gutter */}
                <div className="w-10 bg-canvas/50 py-3.5 select-none text-right pr-3 text-content-subtle border-r border-border-subtle leading-6">
                  {Array.from({ length: Math.max(sqlLines.length, 6) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={userSql}
                  onChange={(e) => setUserSql(e.target.value)}
                  className="flex-1 bg-transparent p-3.5 text-xs font-mono text-content-primary focus:outline-none resize-none leading-6"
                  rows={Math.max(sqlLines.length, 8)}
                  placeholder="SELECT * FROM ...;"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Bottom Actions Bar matching Screenshot 2: Run Code + Red Submit button */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border-default hover:border-border-hover text-content-primary shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current text-content-secondary" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
              </button>
            </div>

            {/* Output Panel matching Screenshot 2 */}
            <div className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-canvas/30 text-xs">
                <div className="font-bold text-content-primary">
                  <span>Output</span>{' '}
                  {queryResult && (
                    <span className="text-content-subtle font-mono font-normal">
                      ({queryResult.rowCount} rows • {queryResult.executionTimeMs}ms)
                    </span>
                  )}
                </div>
                {queryResult && (
                  <button
                    onClick={() => setQueryResult(null)}
                    className="text-xs text-content-subtle hover:text-content-primary transition"
                  >
                    Clear Output
                  </button>
                )}
              </div>

              {/* Validation Result Banner */}
              {validationResult && (
                <div
                  className={`p-3.5 border-b text-xs flex items-start gap-2.5 ${
                    validationResult.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {validationResult.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-bold">
                      {validationResult.passed
                        ? 'Correct Answer! Submissions Passed 🎉'
                        : 'Solution Check Failed'}
                    </span>
                    <p className="text-content-secondary">{validationResult.message}</p>
                  </div>
                </div>
              )}

              {/* Query Error or Rows Table */}
              {queryResult?.error ? (
                <div className="p-4 text-xs font-mono text-rose-400 bg-rose-500/5">
                  {queryResult.error}
                </div>
              ) : queryResult && queryResult.rowCount > 0 ? (
                <div className="max-h-64 overflow-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-canvas/60 border-b border-border-default sticky top-0 font-bold text-content-secondary">
                      <tr>
                        {queryResult.columns.map((col, idx) => (
                          <th
                            key={idx}
                            className="px-3.5 py-2 border-r border-border-subtle last:border-r-0 font-mono text-[11px]"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-mono text-[11px] text-content-primary">
                      {queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface-muted/40 transition">
                          {row.map((val, cIdx) => (
                            <td
                              key={cIdx}
                              className="px-3.5 py-1.5 border-r border-border-subtle last:border-r-0 whitespace-nowrap"
                            >
                              {val === null ? (
                                <span className="text-content-subtle italic">NULL</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-content-subtle">
                  Run Code to see query output or Submit to evaluate your solution.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
