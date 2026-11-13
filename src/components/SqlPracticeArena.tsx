import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Table,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
  Eye,
  Key,
  Layers,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  Code2,
  Search,
  X,
  Columns,
  TableProperties,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PracticeDatabaseType,
  PracticeQuestion,
  PracticeTableSchema,
  HOSPITAL_SCHEMAS,
  HOSPITAL_SEED_SQL,
  HOSPITAL_QUESTIONS,
  NORTHWIND_SCHEMAS,
  NORTHWIND_SEED_SQL,
  NORTHWIND_QUESTIONS,
  W3RESOURCE_SCHEMAS,
  W3RESOURCE_SEED_SQL,
} from '../data/modules/sqlPracticeData';
import { W3RESOURCE_ALL_QUESTIONS } from '../data/modules/w3FullPracticeData';
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

const STORAGE_KEY_COMPLETED = 'sqlmastery_practice_completed_ids_v1';

export const SqlPracticeArena: React.FC<SqlPracticeArenaProps> = ({
  onOpenAITutorWithContext,
  initialDb = 'w3resource',
}) => {
  const [activeDb, setActiveDb] = useState<PracticeDatabaseType>(initialDb);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getDbConfig = (db: PracticeDatabaseType) => {
    switch (db) {
      case 'hospital':
        return { questions: HOSPITAL_QUESTIONS, schemas: HOSPITAL_SCHEMAS, seedSql: HOSPITAL_SEED_SQL };
      case 'northwind':
        return { questions: NORTHWIND_QUESTIONS, schemas: NORTHWIND_SCHEMAS, seedSql: NORTHWIND_SEED_SQL };
      case 'w3resource':
        return { questions: W3RESOURCE_ALL_QUESTIONS, schemas: W3RESOURCE_SCHEMAS, seedSql: W3RESOURCE_SEED_SQL };
    }
  };

  const { questions, schemas, seedSql } = getDbConfig(activeDb);

  // Extract unique categories for active DB
  const categories = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (filterCategory !== 'all' && q.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchDesc = q.description.toLowerCase().includes(query);
        const matchCat = q.category?.toLowerCase().includes(query) ?? false;
        const matchTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
      }
      return true;
    });
  }, [questions, filterDifficulty, filterCategory, searchQuery]);

  const [activeQuestionId, setActiveQuestionId] = useState<string>(() => {
    return filteredQuestions[0]?.id || questions[0].id;
  });

  // Ensure current question is valid
  const currentQuestion =
    questions.find((q) => q.id === activeQuestionId) || filteredQuestions[0] || questions[0];

  const [userSql, setUserSql] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(true);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState<boolean>(false);

  // Table inspector state
  const [activeSchemaTable, setActiveSchemaTable] = useState<PracticeTableSchema | null>(null);
  const [tableSampleData, setTableSampleData] = useState<QueryResult | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);
  const [isSchemaDrawerOpen, setIsSchemaDrawerOpen] = useState<boolean>(true);

  // Clear query editor when switching questions so student starts fresh
  useEffect(() => {
    setUserSql('');
    setQueryResult(null);
    setValidationResult(null);
  }, [currentQuestion.id]);

  // When switching database, reset filters and select first question
  const handleSwitchDb = (db: PracticeDatabaseType) => {
    setActiveDb(db);
    setFilterCategory('all');
    setFilterDifficulty('all');
    setSearchQuery('');
    const newConfig = getDbConfig(db);
    setActiveQuestionId(newConfig.questions[0].id);
    setUserSql('');
    setQueryResult(null);
    setValidationResult(null);
    setActiveSchemaTable(null);
    setTableSampleData(null);
  };

  const handleRunQuery = async () => {
    if (!userSql.trim() || isRunning) return;
    setIsRunning(true);
    setValidationResult(null);

    const res = await executeQuery(seedSql, userSql);
    setQueryResult(res);
    setIsRunning(false);
  };

  const handleValidateSolution = async () => {
    if (!userSql.trim() || isRunning) return;
    setIsRunning(true);

    const val = await validateSolution(seedSql, userSql, currentQuestion.solutionSql);
    setValidationResult(val);
    setQueryResult(val.userResult || null);
    setIsRunning(false);

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
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }
  };

  // Preview table data
  const handleInspectTable = async (table: PracticeTableSchema) => {
    if (activeSchemaTable?.tableName === table.tableName) {
      setActiveSchemaTable(null);
      setTableSampleData(null);
      return;
    }
    setActiveSchemaTable(table);
    setIsLoadingSample(true);
    try {
      const res = await executeQuery(seedSql, `SELECT * FROM ${table.tableName} LIMIT 5;`);
      setTableSampleData(res);
    } catch {
      setTableSampleData(null);
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Detect tables referenced in the current question
  const referencedTables = useMemo(() => {
    const list: PracticeTableSchema[] = [];
    schemas.forEach((schema) => {
      const name = schema.tableName.toLowerCase();
      const inDesc = currentQuestion.description.toLowerCase().includes(name);
      const inSol = currentQuestion.solutionSql.toLowerCase().includes(name);
      const inTags = currentQuestion.tags.some((t) => t.toLowerCase() === name);
      if (inDesc || inSol || inTags) {
        list.push(schema);
      }
    });
    return list.length > 0 ? list : [schemas[0]];
  }, [schemas, currentQuestion]);

  // Overall metrics
  const totalSolvedAcrossAll =
    HOSPITAL_QUESTIONS.filter((q) => completedIds.includes(q.id)).length +
    NORTHWIND_QUESTIONS.filter((q) => completedIds.includes(q.id)).length +
    W3RESOURCE_ALL_QUESTIONS.filter((q) => completedIds.includes(q.id)).length;
  const totalQuestionsAcrossAll =
    HOSPITAL_QUESTIONS.length + NORTHWIND_QUESTIONS.length + W3RESOURCE_ALL_QUESTIONS.length;

  const currentDbSolved = questions.filter((q) => completedIds.includes(q.id)).length;
  const sqlLines = userSql.split('\n');

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-content-primary p-4 sm:p-6 lg:p-8 font-ui">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* TOP HEADER: BRAND + DB SWITCHER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-accent-500" />
              <h1 className="text-xl font-bold tracking-tight text-content-primary">
                SQL Practice Arena
              </h1>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface border border-border-default text-content-secondary">
              <span className="text-accent-500 font-bold">{totalSolvedAcrossAll}</span>
              <span className="text-content-subtle">/{totalQuestionsAcrossAll} Solved</span>
            </div>
          </div>

          {/* Database Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => handleSwitchDb('w3resource')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                activeDb === 'w3resource'
                  ? 'bg-surface border-cyan-500/80 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-surface/50 border-border-default text-content-secondary hover:text-content-primary'
              }`}
            >
              <span>📚 W3Resource Suite</span>
              <span className="text-[10px] opacity-75 font-mono">
                {W3RESOURCE_ALL_QUESTIONS.filter((q) => completedIds.includes(q.id)).length}/{W3RESOURCE_ALL_QUESTIONS.length}
              </span>
            </button>

            <button
              onClick={() => handleSwitchDb('northwind')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                activeDb === 'northwind'
                  ? 'bg-surface border-cyan-500/80 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-surface/50 border-border-default text-content-secondary hover:text-content-primary'
              }`}
            >
              <span>📦 Northwind DB</span>
              <span className="text-[10px] opacity-75 font-mono">
                {NORTHWIND_QUESTIONS.filter((q) => completedIds.includes(q.id)).length}/{NORTHWIND_QUESTIONS.length}
              </span>
            </button>

            <button
              onClick={() => handleSwitchDb('hospital')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                activeDb === 'hospital'
                  ? 'bg-surface border-cyan-500/80 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-surface/50 border-border-default text-content-secondary hover:text-content-primary'
              }`}
            >
              <span>🏥 Hospital DB</span>
              <span className="text-[10px] opacity-75 font-mono">
                {HOSPITAL_QUESTIONS.filter((q) => completedIds.includes(q.id)).length}/{HOSPITAL_QUESTIONS.length}
              </span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN FORMAL PRACTICE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Question List, Search & Category Filters */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-content-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises by title or table..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-content-primary placeholder:text-content-subtle focus:outline-none focus:border-accent-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-primary text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Bar: Category & Difficulty */}
            <div className="space-y-2 bg-surface/50 p-2.5 rounded-xl border border-border-default">
              {/* Difficulty selector pills */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-content-subtle">
                  Difficulty
                </span>
                <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border-default">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setFilterDifficulty(diff)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition cursor-pointer ${
                        filterDifficulty === diff
                          ? 'bg-surface-muted text-content-primary shadow-sm font-bold'
                          : 'text-content-subtle hover:text-content-primary'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Dropdown (if active DB has multiple categories) */}
              {categories.length > 1 && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border-subtle">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-content-subtle">
                    Track
                  </span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-surface text-content-primary text-[11px] font-medium border border-border-default rounded-md px-2 py-1 focus:outline-none cursor-pointer max-w-[200px]"
                  >
                    <option value="all">All Tracks ({questions.length})</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({questions.filter((q) => q.category === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-[11px] text-content-subtle px-1 flex items-center justify-between">
              <span>Showing {filteredQuestions.length} of {questions.length} exercises</span>
              <span>{currentDbSolved} Solved</span>
            </div>

            {/* Questions List */}
            <div className="space-y-2.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
              {filteredQuestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-content-subtle border border-dashed border-border-default rounded-xl">
                  No exercises match your filter criteria.
                </div>
              ) : (
                filteredQuestions.map((q, idx) => {
                  const isSelected = q.id === currentQuestion.id;
                  const isDone = completedIds.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionId(q.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-surface border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-md'
                          : 'bg-surface border-border-default hover:border-border-hover'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              q.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : q.difficulty === 'medium'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          {q.category && (
                            <span className="text-[10px] text-content-subtle font-mono uppercase tracking-wider">
                              • {q.category}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xs font-bold text-content-primary line-clamp-1">
                          {idx + 1}. {q.title}
                        </h2>

                        <p className="text-[11px] text-content-secondary line-clamp-2 leading-relaxed">
                          {q.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px]">
                        <span className="text-content-subtle font-mono">
                          {q.tags.slice(0, 2).join(' • ')}
                        </span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Solved</span>
                          </span>
                        ) : (
                          <span className="text-content-subtle font-medium">Unsolved</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Formal Practice Arena Workspace */}
          <div className="lg:col-span-8 space-y-4">
            {/* Question Header: Title, Category, AI Tutor button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    currentQuestion.difficulty === 'easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                {currentQuestion.category && (
                  <span className="text-xs font-semibold text-content-subtle uppercase tracking-wider">
                    • {currentQuestion.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-content-primary">
                  {currentQuestion.title}
                </h3>
              </div>

              <button
                onClick={() =>
                  onOpenAITutorWithContext({
                    topicTitle: currentQuestion.title,
                    instructions: currentQuestion.description,
                    schemaSql: seedSql,
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

            {/* Clear Description Text with Target Tables Chips */}
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
                {currentQuestion.description}
              </p>

              {/* Target Tables Chips (Clickable to view schema immediately) */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-content-subtle text-[11px] font-semibold">Active Tables:</span>
                {referencedTables.map((tbl) => (
                  <button
                    key={tbl.tableName}
                    onClick={() => handleInspectTable(tbl)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-surface border border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 transition cursor-pointer"
                  >
                    <TableProperties className="w-3 h-3" />
                    <span>{tbl.tableName}</span>
                    <span className="text-[10px] opacity-75">({tbl.columns.length} cols)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE TABLE & SCHEMA VIEWER (Always Visible/Expandable) */}
            <div className="bg-surface/80 border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border-subtle bg-canvas/40">
                <div className="flex items-center gap-2 text-xs">
                  <Table className="w-4 h-4 text-accent-500" />
                  <span className="font-bold text-content-primary">
                    Database Schema & Available Tables ({schemas.length})
                  </span>
                  <span className="text-[10px] text-content-subtle">
                    (Click any table to view columns & sample data)
                  </span>
                </div>
                <button
                  onClick={() => setIsSchemaDrawerOpen((prev) => !prev)}
                  className="text-xs text-content-subtle hover:text-content-primary flex items-center gap-1 transition"
                >
                  <span>{isSchemaDrawerOpen ? 'Collapse' : 'Expand'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSchemaDrawerOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
              </div>

              {isSchemaDrawerOpen && (
                <div className="p-3 space-y-3">
                  {/* Table selector buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {schemas.map((tbl) => {
                      const isSelected = activeSchemaTable?.tableName === tbl.tableName;
                      const isReferenced = referencedTables.some((rt) => rt.tableName === tbl.tableName);
                      return (
                        <button
                          key={tbl.tableName}
                          onClick={() => handleInspectTable(tbl)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-accent-600/20 border-accent-500 text-accent-400 font-bold shadow-sm'
                              : isReferenced
                              ? 'bg-surface border-cyan-500/40 text-cyan-300 hover:border-cyan-500'
                              : 'bg-surface/60 border-border-default text-content-secondary hover:text-content-primary'
                          }`}
                        >
                          <Columns className="w-3 h-3 text-content-subtle" />
                          <span>{tbl.tableName}</span>
                          <span className="text-[10px] opacity-75">({tbl.columns.length})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inspected Table Detail Modal/Drawer */}
                  {activeSchemaTable && (
                    <div className="bg-canvas border border-border-default rounded-lg p-3 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-accent-400">
                              {activeSchemaTable.tableName}
                            </span>
                            <span className="text-[10px] text-content-subtle">
                              • {activeSchemaTable.description}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSchemaTable(null);
                            setTableSampleData(null);
                          }}
                          className="text-xs text-content-subtle hover:text-content-primary"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Columns List */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono">
                        {activeSchemaTable.columns.map((col) => (
                          <div
                            key={col.name}
                            className="bg-surface p-2 rounded border border-border-subtle flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-content-primary">{col.name}</span>
                              {col.isPk && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                  PK
                                </span>
                              )}
                              {col.isFk && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                                  FK
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-content-subtle">{col.type}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sample Rows Preview */}
                      <div className="pt-2 border-t border-border-subtle">
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="font-semibold text-content-secondary">
                            Sample Rows (Limit 5):
                          </span>
                          {isLoadingSample && (
                            <span className="text-[10px] text-content-subtle">Loading rows...</span>
                          )}
                        </div>

                        {tableSampleData && tableSampleData.rowCount > 0 ? (
                          <div className="max-h-40 overflow-auto border border-border-subtle rounded">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-surface/80 border-b border-border-default sticky top-0 font-bold text-content-secondary">
                                <tr>
                                  {tableSampleData.columns.map((c, i) => (
                                    <th key={i} className="px-3 py-1.5 border-r border-border-subtle font-mono text-[11px]">
                                      {c}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-subtle font-mono text-[11px] text-content-primary">
                                {tableSampleData.values.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-surface-muted/40">
                                    {row.map((val, cIdx) => (
                                      <td key={cIdx} className="px-3 py-1 border-r border-border-subtle whitespace-nowrap">
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
                          <p className="text-[11px] text-content-subtle italic">
                            No sample records loaded.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Collapsible Formal Hint Box */}
            <div className="bg-surface/70 border border-border-default rounded-xl p-3 text-xs text-content-secondary flex items-start gap-2.5">
              <button
                onClick={() => setIsHintOpen((prev) => !prev)}
                className="mt-0.5 text-content-subtle hover:text-content-primary transition cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isHintOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-content-primary">Hint: </span>
                {isHintOpen ? (
                  <span>{currentQuestion.hint}</span>
                ) : (
                  <span className="text-content-subtle italic">Click to expand hint</span>
                )}
              </div>
            </div>

            {/* FORMAL SQL CODE EDITOR */}
            <div className="bg-surface border border-border-default rounded-xl overflow-hidden shadow-e1">
              <div className="relative font-mono text-xs flex min-h-[180px]">
                {/* Line numbers gutter */}
                <div className="w-10 bg-canvas/40 py-3 select-none text-right pr-3 text-content-subtle border-r border-border-subtle leading-6">
                  {Array.from({ length: Math.max(sqlLines.length, 5) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={userSql}
                  onChange={(e) => setUserSql(e.target.value)}
                  className="flex-1 bg-transparent p-3 text-xs font-mono text-content-primary focus:outline-none resize-none leading-6"
                  rows={Math.max(sqlLines.length, 6)}
                  placeholder="Enter your SQL query here (e.g. SELECT * FROM salesman;)..."
                  spellCheck={false}
                />

                {/* Floating Bottom Right Actions: Reset & Run Query button in green */}
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    onClick={() => setUserSql('')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface/90 border border-border-default transition cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleRunQuery}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunning ? 'Running...' : 'Run Query'}</span>
                  </button>
                  <button
                    onClick={handleValidateSolution}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-accent-600 hover:bg-accent-500 shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Check Solution</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VALIDATION ALERT */}
            {validationResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  validationResult.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {validationResult.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <span className="font-bold">
                    {validationResult.passed
                      ? 'Correct Solution! Great job!'
                      : 'Output Does Not Match Canonical Answer'}
                  </span>
                  <p className="text-content-secondary">{validationResult.message}</p>
                </div>
              </div>
            )}

            {/* QUERY OUTPUT DATA TABLE */}
            <div className="bg-surface border border-border-default rounded-xl overflow-hidden shadow-e1">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-canvas/30 text-xs">
                <div className="font-semibold text-content-primary">
                  <span>Query Output</span>{' '}
                  {queryResult && (
                    <span className="text-content-subtle font-mono">
                      ({queryResult.rowCount} rows • {queryResult.executionTimeMs}ms)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQueryResult(null)}
                    className="text-xs text-content-subtle hover:text-content-primary transition cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsSolutionModalOpen(true)}
                    className="text-xs font-semibold text-accent-500 hover:underline cursor-pointer"
                  >
                    View Solution
                  </button>
                </div>
              </div>

              {queryResult?.error ? (
                <div className="p-4 text-xs font-mono text-rose-400 bg-rose-500/5">
                  {queryResult.error}
                </div>
              ) : queryResult && queryResult.rowCount > 0 ? (
                <div className="max-h-72 overflow-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-canvas/60 border-b border-border-default sticky top-0 font-bold text-content-secondary">
                      <tr>
                        {queryResult.columns.map((col, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-2 border-r border-border-subtle last:border-r-0"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-mono text-content-primary">
                      {queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface-muted/50 transition">
                          {row.map((val, cIdx) => (
                            <td
                              key={cIdx}
                              className="px-4 py-2 border-r border-border-subtle last:border-r-0 whitespace-nowrap"
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
                  Execute query above or click &quot;Run Query&quot; to inspect output rows.
                </div>
              )}
            </div>

            {/* REFERENCE SOLUTION MODAL */}
            {isSolutionModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-surface border border-border-default rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <h3 className="text-sm font-bold text-content-primary">
                      Canonical Reference Solution
                    </h3>
                    <button
                      onClick={() => setIsSolutionModalOpen(false)}
                      className="text-xs text-content-subtle hover:text-content-primary"
                    >
                      Close
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-canvas border border-border-default text-xs font-mono text-content-primary overflow-x-auto leading-relaxed">
                    {currentQuestion.solutionSql}
                  </pre>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setUserSql(currentQuestion.solutionSql);
                        setIsSolutionModalOpen(false);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Copy to Editor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
