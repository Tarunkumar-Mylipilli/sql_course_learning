import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  Eye,
  Key,
  Layers,
  HelpCircle,
  AlertTriangle,
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
} from '../data/modules/sqlPracticeData';
import { executeQuery, validateSolution, QueryResult, ValidationResult } from '../lib/sqlEngine';

interface SqlPracticeArenaProps {
  onOpenAITutorWithContext: (context: {
    topicTitle: string;
    instructions: string;
    schemaSql: string;
    userSql: string;
    errorMessage?: string;
  }) => void;
}

const STORAGE_KEY_COMPLETED = 'sqlmastery_practice_completed_ids_v1';

export const SqlPracticeArena: React.FC<SqlPracticeArenaProps> = ({
  onOpenAITutorWithContext,
}) => {
  const [activeDb, setActiveDb] = useState<PracticeDatabaseType>('hospital');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const questions = activeDb === 'hospital' ? HOSPITAL_QUESTIONS : NORTHWIND_QUESTIONS;
  const schemas: PracticeTableSchema[] = activeDb === 'hospital' ? HOSPITAL_SCHEMAS : NORTHWIND_SCHEMAS;
  const seedSql = activeDb === 'hospital' ? HOSPITAL_SEED_SQL : NORTHWIND_SEED_SQL;

  const filteredQuestions = questions.filter((q) =>
    filterDifficulty === 'all' ? true : q.difficulty === filterDifficulty
  );

  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0].id);
  const currentQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const [userSql, setUserSql] = useState<string>(currentQuestion.starterSql);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'query' | 'schema' | 'solution'>('query');
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>(schemas[0].tableName);

  // Sync starter SQL when switching questions
  useEffect(() => {
    setUserSql(currentQuestion.starterSql);
    setQueryResult(null);
    setValidationResult(null);
  }, [currentQuestion.id]);

  // When switching database, default to first question
  const handleSwitchDb = (db: PracticeDatabaseType) => {
    setActiveDb(db);
    const newQuestions = db === 'hospital' ? HOSPITAL_QUESTIONS : NORTHWIND_QUESTIONS;
    setActiveQuestionId(newQuestions[0].id);
    setUserSql(newQuestions[0].starterSql);
    setQueryResult(null);
    setValidationResult(null);
    setSelectedSchemaTable(db === 'hospital' ? HOSPITAL_SCHEMAS[0].tableName : NORTHWIND_SCHEMAS[0].tableName);
  };

  const handleRunQuery = async () => {
    if (!userSql.trim() || isRunning) return;
    setIsRunning(true);
    setValidationResult(null);

    const fullSql = `${seedSql}\n${userSql}`;
    const res = await executeQuery(fullSql);
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

  const isCurrentCompleted = completedIds.includes(currentQuestion.id);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner / Dataset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border-default shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-600/20 text-accent-500 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-content-primary">
                SQL Practice Arena (sql-practice.com Edition)
              </h1>
              <p className="text-xs text-content-secondary">
                Practice real-world production queries on Hospital and Northwind datasets with instant evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* Database Switcher Pills */}
        <div className="flex items-center gap-2 bg-canvas p-1.5 rounded-xl border border-border-default">
          <button
            onClick={() => handleSwitchDb('hospital')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeDb === 'hospital'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <span>🏥 Hospital DB</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">
              {HOSPITAL_QUESTIONS.filter((q) => completedIds.includes(q.id)).length}/{HOSPITAL_QUESTIONS.length}
            </span>
          </button>
          <button
            onClick={() => handleSwitchDb('northwind')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeDb === 'northwind'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <span>📦 Northwind DB</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">
              {NORTHWIND_QUESTIONS.filter((q) => completedIds.includes(q.id)).length}/{NORTHWIND_QUESTIONS.length}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Browser */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface rounded-2xl border border-border-default p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                {activeDb === 'hospital' ? 'Hospital' : 'Northwind'} Questions
              </span>
              {/* Difficulty filter */}
              <div className="flex items-center gap-1">
                {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      filterDifficulty === diff
                        ? 'bg-accent-600 text-white'
                        : 'text-content-muted hover:text-content-primary bg-canvas border border-border-subtle'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredQuestions.map((q, idx) => {
                const isSelected = q.id === currentQuestion.id;
                const isDone = completedIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-accent-500/10 border-accent-500 ring-1 ring-accent-500'
                        : 'bg-canvas/60 hover:bg-canvas border-border-default'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            q.difficulty === 'easy'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : q.difficulty === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-xs font-semibold text-content-primary line-clamp-1">
                          {idx + 1}. {q.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-muted line-clamp-2">{q.description}</p>
                    </div>
                    {isDone && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Question Details, SQL Editor, Schema Explorer, Execution */}
        <div className="lg:col-span-8 space-y-4">
          {/* Question Details Header */}
          <div className="bg-surface rounded-2xl border border-border-default p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      currentQuestion.difficulty === 'easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : currentQuestion.difficulty === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <h2 className="text-base font-bold text-content-primary">
                    {currentQuestion.title}
                  </h2>
                </div>
                <p className="text-sm text-content-secondary leading-relaxed">
                  {currentQuestion.description}
                </p>
              </div>

              {/* Ask Socratic AI Tutor button */}
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
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </button>
            </div>

            {/* Hint alert */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-500/5 border border-accent-500/20 text-xs text-content-secondary">
              <HelpCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-content-primary">Hint: </span>
                {currentQuestion.hint}
              </div>
            </div>
          </div>

          {/* Editor & Schema Explorer Tabs */}
          <div className="bg-surface rounded-2xl border border-border-default overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-default px-4 bg-canvas">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('query')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'query'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-content-muted hover:text-content-primary'
                  }`}
                >
                  <span>SQL Query Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schema'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-content-muted hover:text-content-primary'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Schema Explorer</span>
                </button>
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'solution'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-content-muted hover:text-content-primary'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Reference Solution</span>
                </button>
              </div>

              {/* Actions */}
              {activeTab === 'query' && (
                <div className="flex items-center gap-2 py-2">
                  <button
                    onClick={() => setUserSql(currentQuestion.starterSql)}
                    className="p-1.5 text-content-muted hover:text-content-primary rounded hover:bg-surface transition cursor-pointer"
                    title="Reset to starter query"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRunQuery}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface/80 border border-border-default text-xs font-semibold text-content-primary transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-accent-500" />
                    <span>Run Query</span>
                  </button>
                  <button
                    onClick={handleValidateSolution}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Check Solution</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab: Query Editor */}
            {activeTab === 'query' && (
              <div className="p-4 space-y-4">
                <textarea
                  value={userSql}
                  onChange={(e) => setUserSql(e.target.value)}
                  className="w-full h-44 p-4 font-mono text-sm bg-canvas border border-border-default rounded-xl text-content-primary focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 resize-none"
                  placeholder="Write your SQL solution query here..."
                  spellCheck={false}
                />

                {/* Validation Status / Alert */}
                {validationResult && (
                  <div
                    role={validationResult.passed ? 'status' : 'alert'}
                    aria-live={validationResult.passed ? 'polite' : 'assertive'}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      validationResult.passed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {validationResult.passed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold text-sm">
                        {validationResult.passed
                          ? 'Correct Solution! Great job!'
                          : 'Output Does Not Match Expected Result'}
                      </p>
                      <p className="text-xs leading-relaxed">{validationResult.message}</p>
                      {validationResult.mismatchReason && (
                        <p className="text-xs font-mono text-rose-200 mt-1">
                          {validationResult.mismatchReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Table */}
                {queryResult && (
                  <div className="space-y-2" role="status" aria-live="polite">
                    <div className="flex items-center justify-between text-xs text-content-muted">
                      <span>Query Output: {queryResult.rowCount} rows</span>
                      <span>Execution time: {queryResult.executionTimeMs}ms</span>
                    </div>

                    {queryResult.error ? (
                      <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-mono" role="alert" aria-live="assertive">
                        {queryResult.error}
                      </div>
                    ) : queryResult.rowCount === 0 ? (
                      <div className="p-4 bg-canvas rounded-xl border border-border-default text-xs text-content-muted text-center">
                        Query returned 0 rows.
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-auto rounded-xl border border-border-default">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-canvas border-b border-border-default sticky top-0">
                            <tr>
                              {queryResult.columns.map((col, idx) => (
                                <th
                                  key={idx}
                                  className="px-3 py-2 font-bold text-content-secondary border-r border-border-subtle last:border-r-0"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle font-mono text-content-primary">
                            {queryResult.values.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-surface/50 transition">
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-3 py-1.5 border-r border-border-subtle last:border-r-0 whitespace-nowrap"
                                  >
                                    {cell === null ? (
                                      <span className="text-content-muted italic">NULL</span>
                                    ) : (
                                      String(cell)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Schema Explorer */}
            {activeTab === 'schema' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap border-b border-border-default pb-3">
                  {schemas.map((s) => (
                    <button
                      key={s.tableName}
                      onClick={() => setSelectedSchemaTable(s.tableName)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        selectedSchemaTable === s.tableName
                          ? 'bg-accent-600 text-white'
                          : 'bg-canvas text-content-secondary hover:text-content-primary border border-border-default'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>{s.tableName}</span>
                    </button>
                  ))}
                </div>

                {(() => {
                  const currTable = schemas.find((s) => s.tableName === selectedSchemaTable) || schemas[0];
                  return (
                    <div className="space-y-3">
                      <p className="text-xs text-content-secondary">{currTable.description}</p>
                      <div className="rounded-xl border border-border-default overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-canvas border-b border-border-default text-content-secondary">
                            <tr>
                              <th className="px-3 py-2 font-bold">Column</th>
                              <th className="px-3 py-2 font-bold">Type</th>
                              <th className="px-3 py-2 font-bold">Key / Constraint</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle font-mono text-content-primary">
                            {currTable.columns.map((col, idx) => (
                              <tr key={idx} className="hover:bg-surface/50">
                                <td className="px-3 py-2 font-semibold text-accent-500">{col.name}</td>
                                <td className="px-3 py-2 text-content-secondary">{col.type}</td>
                                <td className="px-3 py-2">
                                  {col.isPk && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                      <Key className="w-3 h-3" /> PRIMARY KEY
                                    </span>
                                  )}
                                  {col.isFk && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                                      FK → {col.fkRef}
                                    </span>
                                  )}
                                  {!col.isPk && !col.isFk && (
                                    <span className="text-content-muted text-[11px]">
                                      {col.nullable ? 'NULLABLE' : 'NOT NULL'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tab: Solution */}
            {activeTab === 'solution' && (
              <div className="p-4 space-y-4">
                <div className="p-4 bg-canvas rounded-xl border border-border-default space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-content-primary">Canonical Solution Query:</span>
                    <button
                      onClick={() => {
                        setUserSql(currentQuestion.solutionSql);
                        setActiveTab('query');
                      }}
                      className="text-xs font-semibold text-accent-500 hover:underline cursor-pointer"
                    >
                      Copy to Editor & Run
                    </button>
                  </div>
                  <pre className="p-3 bg-surface rounded-lg border border-border-subtle font-mono text-xs text-content-primary overflow-x-auto">
                    {currentQuestion.solutionSql}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
