import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Database,
  Lightbulb,
  Table,
  Clock,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  X,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingChallenge } from '../types';
import { executeQuery, validateSolution, QueryResult, ValidationResult } from '../lib/sqlEngine';
import { SCENARIO_THEMES, ScenarioTheme, generateLocalExercise } from '../lib/aiExerciseGenerator';
import { getRandomCodingChallenge } from '../lib/randomizer';

interface CodingWorkspaceProps {
  challenge: CodingChallenge;
  challenges?: CodingChallenge[];
  topicTitle: string;
  isCompleted: boolean;
  savedSql?: string;
  onCodingComplete: (sql: string) => void;
  onProceedToNextTopic: () => void;
  hasNextTopic: boolean;
  onOpenAITutorWithContext: (context: {
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  }) => void;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  challenge,
  challenges,
  topicTitle,
  isCompleted,
  savedSql,
  onCodingComplete,
  onProceedToNextTopic,
  hasNextTopic,
  onOpenAITutorWithContext,
}) => {
  const [dynamicChallenges, setDynamicChallenges] = useState<CodingChallenge[]>([]);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  const initialList = challenges && challenges.length > 0 ? challenges : [challenge];
  const challengeList = [...initialList, ...dynamicChallenges];
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState<number>(0);
  const currentChallenge = challengeList[selectedChallengeIdx] || challenge;

  const [userSql, setUserSql] = useState<string>(
    selectedChallengeIdx === 0 && savedSql ? savedSql : currentChallenge.starterSql
  );
  const [activeTab, setActiveTab] = useState<'instructions' | 'schema' | 'hints'>('instructions');
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    isCompleted ? [currentChallenge.id] : []
  );

  // Sync editor when switching challenge
  useEffect(() => {
    setUserSql(currentChallenge.starterSql);
    setQueryResult(null);
    setValidationResult(null);
    setSelectedTableIndex(0);
    setUnlockedHints([]);
  }, [selectedChallengeIdx]);

  const handlePickRandomChallenge = () => {
    if (challengeList.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * challengeList.length);
    if (nextIdx === selectedChallengeIdx) {
      nextIdx = (nextIdx + 1) % challengeList.length;
    }
    setSelectedChallengeIdx(nextIdx);
  };

  // Keyboard shortcut Ctrl+Enter to run query
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  const handleRunQuery = async () => {
    setIsRunning(true);
    setValidationResult(null);
    try {
      const result = await executeQuery(currentChallenge.schemaSql, userSql);
      setQueryResult(result);
    } catch (err: any) {
      setQueryResult({
        columns: [],
        values: [],
        error: err?.message || 'Execution error',
        rowCount: 0,
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const validation = await validateSolution(
        currentChallenge.schemaSql,
        userSql,
        currentChallenge.solutionSql,
        currentChallenge.expectedColumns
      );
      setValidationResult(validation);
      if (validation.userResult) {
        setQueryResult(validation.userResult);
      }

      if (validation.passed) {
        onCodingComplete(userSql);
        if (!completedChallengeIds.includes(currentChallenge.id)) {
          setCompletedChallengeIds([...completedChallengeIds, currentChallenge.id]);
        }
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    } catch (err: any) {
      setValidationResult({
        passed: false,
        message: err?.message || 'Validation error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserSql(currentChallenge.starterSql);
    setQueryResult(null);
    setValidationResult(null);
  };

  const toggleHint = (index: number) => {
    if (unlockedHints.includes(index)) {
      setUnlockedHints(unlockedHints.filter((h) => h !== index));
    } else {
      setUnlockedHints([...unlockedHints, index]);
    }
  };

  const handleGenerateThemeScenario = (theme: ScenarioTheme) => {
    const newEx = generateLocalExercise(topicTitle, theme);
    const updated = [...dynamicChallenges, newEx];
    setDynamicChallenges(updated);
    setSelectedChallengeIdx(initialList.length + dynamicChallenges.length);
    setShowThemeModal(false);
  };

  const currentTable = currentChallenge.tables[selectedTableIndex] || currentChallenge.tables[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Multi-Practice Problem Selector Bar & AI Scenario Generator */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Practice Exercises for this Topic ({challengeList.length} scenarios):</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {challengeList.map((ch, idx) => {
            const isDone = completedChallengeIds.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChallengeIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  selectedChallengeIdx === idx
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : isDone
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-slate-300 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                )}
                <span>{ch.sourceId || ch.title.split(':')[0]}</span>
              </button>
            );
          })}

          {/* Random Challenge Selector */}
          <button
            onClick={handlePickRandomChallenge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Randomly pick one challenge from the coding bank"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>🎲 Random Challenge</span>
          </button>

          {/* AI Scenario Generator Button */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
            title="Generate a brand-new scenario (E-commerce, Healthcare, Fintech, Streaming, etc.)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>✨ Generate AI Scenario</span>
          </button>
        </div>
      </div>

      {/* Scenario Theme Selector Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Generate Fresh AI Practice Scenario</h3>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select an industry scenario to generate a brand new realistic problem with its own tables, dataset, and solution:
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {SCENARIO_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleGenerateThemeScenario(theme.id)}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/60 text-left transition cursor-pointer flex flex-col justify-between space-y-1.5"
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-xs font-bold text-slate-200 block">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Title Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Code2 className="w-3 h-3" /> Step 4: SQL Coding Sandbox
            </span>
            {currentChallenge.source && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {currentChallenge.source}
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                currentChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : currentChallenge.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {currentChallenge.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{currentChallenge.title}</h2>
          <p className="text-xs text-slate-400">
            Write standard SQL, execute in real SQLite WebAssembly, and test against expected benchmarks.
          </p>
        </div>

        {completedChallengeIds.includes(currentChallenge.id) && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold self-start md:self-center">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Task Solved!</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Workspace Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context, Schema & Hints (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Task Prompt
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'schema'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Tables ({currentChallenge.tables.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'hints'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Hints ({currentChallenge.hints.length})</span>
            </button>
          </div>

          {/* Tab 1: Instructions */}
          {activeTab === 'instructions' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Challenge Objectives
                </h3>
                <div className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {currentChallenge.instructions}
                </div>
              </div>

              {currentChallenge.expectedColumns && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Expected Output Columns
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentChallenge.expectedColumns.map((col, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">💡 Pro Tips:</p>
                <p>
                  • Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Ctrl</kbd> +{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Enter</kbd> to run your query instantly.
                </p>
                <p>• Inspect column types and sample rows in the <strong>Tables</strong> tab.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Schema Inspector */}
          {activeTab === 'schema' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              {/* Table Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {currentChallenge.tables.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTableIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      selectedTableIndex === idx
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>

              {/* Table Schema */}
              {currentTable && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Columns in `{currentTable.name}`
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-2.5">Field</th>
                            <th className="p-2.5">Type</th>
                            <th className="p-2.5">Key</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                          {currentTable.columns.map((c, i) => (
                            <tr key={i}>
                              <td className="p-2.5 font-mono text-sky-300 font-medium">{c.name}</td>
                              <td className="p-2.5 font-mono text-slate-400">{c.type}</td>
                              <td className="p-2.5">
                                {c.isPk && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                    PK
                                  </span>
                                )}
                                {c.isFk && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                                    FK
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sample Rows Preview */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Sample Data ({currentTable.sampleData.length} records)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-48">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] sticky top-0">
                          <tr>
                            {currentTable.columns.map((c, i) => (
                              <th key={i} className="p-2 font-mono">
                                {c.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 font-mono text-slate-300">
                          {currentTable.sampleData.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/60">
                              {currentTable.columns.map((c, cIdx) => (
                                <td key={cIdx} className="p-2 truncate max-w-[140px]">
                                  {row[c.name] !== undefined ? String(row[c.name]) : 'NULL'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Progressive Hints */}
          {activeTab === 'hints' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Guiding Hints (Click to Reveal)
              </h3>
              {currentChallenge.hints.map((hint, idx) => {
                const isOpen = unlockedHints.includes(idx);
                return (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <button
                      onClick={() => toggleHint(idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hint #{idx + 1}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-amber-200/90 leading-relaxed font-mono">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Editor Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Editor Toolbar */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>SQL Query Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Reset to starter query"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() =>
                    onOpenAITutorWithContext({
                      userSql,
                      errorMessage: queryResult?.error,
                      mismatchDetails: validationResult?.mismatchReason,
                    })
                  }
                  className="flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-100 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Get AI Hint</span>
                </button>
              </div>
            </div>

            {/* Monospaced Editor Textarea */}
            <div className="relative">
              <textarea
                value={userSql}
                onChange={(e) => setUserSql(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your SQL query here..."
                rows={9}
                className="w-full p-4 bg-slate-950 text-sky-200 font-mono text-sm leading-relaxed outline-none resize-y border-none focus:ring-0 selection:bg-sky-500/30"
                spellCheck={false}
              />
            </div>

            {/* Run / Submit Action Bar */}
            <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                ⚡ Press <kbd className="px-1 py-0.5 rounded bg-slate-800 font-mono text-[10px]">Ctrl</kbd> +{' '}
                <kbd className="px-1 py-0.5 rounded bg-slate-800 font-mono text-[10px]">Enter</kbd> to run
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleRunQuery}
                  disabled={isRunning}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isRunning ? 'Running...' : 'Run Query'}</span>
                </button>
                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Test & Submit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Validation Result Banner */}
          {validationResult && (
            <div
              className={`p-4 rounded-2xl border ${
                validationResult.passed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {validationResult.passed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {validationResult.passed ? 'Solution Accepted!' : 'Test Cases Failed'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">{validationResult.message}</p>
                  </div>
                </div>

                {validationResult.passed && (
                  <div className="flex items-center gap-2">
                    {selectedChallengeIdx < challengeList.length - 1 ? (
                      <button
                        onClick={() => setSelectedChallengeIdx(selectedChallengeIdx + 1)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        <span>Next Task in Topic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={onProceedToNextTopic}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        <span>{hasNextTopic ? 'Next Topic in SQL' : 'Course Completed!'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Query Results Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Execution Output</span>
              {queryResult && (
                <div className="flex items-center gap-3 text-[11px]">
                  <span>{queryResult.rowCount} rows</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {queryResult.executionTimeMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* Error or Empty or Results Table */}
            {queryResult?.error ? (
              <div className="p-4 bg-rose-950/20 text-xs font-mono text-rose-300 border-l-4 border-rose-500">
                <span className="font-bold text-rose-400">SQL Error: </span>
                {queryResult.error}
              </div>
            ) : queryResult && queryResult.columns.length > 0 ? (
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="p-2.5">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/50 text-slate-200">
                    {queryResult.values.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 truncate max-w-[180px]">
                            {cell === null ? (
                              <span className="text-slate-500 italic">NULL</span>
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
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Run or test your query above to see live database results here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
