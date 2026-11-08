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
  Shuffle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingChallenge } from '../types';
import { executeQuery, validateSolution, QueryResult, ValidationResult } from '../lib/sqlEngine';
import { fetchChallengeSolution } from '../lib/solutionService';
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
  // 1. Initial coding bank from props
  const codingBank = challenges && challenges.length > 0 ? challenges : [challenge];

  // Dynamic AI generated challenges state
  const [dynamicChallenges, setDynamicChallenges] = useState<CodingChallenge[]>([]);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Combined challenge list
  const fullChallengeList = [...codingBank, ...dynamicChallenges];

  // Active challenge state - initialized to null for mounting hook
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge | null>(null);
  const [userCode, setUserCode] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'instructions' | 'schema' | 'hints'>('instructions');
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    isCompleted ? [challenge.id] : []
  );

  // 1. Mount effect: initialize activeChallenge using getRandomCodingChallenge(codingBank)
  useEffect(() => {
    const randomInitial = getRandomCodingChallenge(codingBank) || codingBank[0] || challenge;
    setActiveChallenge(randomInitial);
    setUserCode(savedSql || randomInitial?.starterSql || '');
  }, []);

  // Sync if topic changes
  useEffect(() => {
    if (activeChallenge && !codingBank.some((c) => c.id === activeChallenge.id)) {
      const fresh = getRandomCodingChallenge(codingBank) || codingBank[0] || challenge;
      setActiveChallenge(fresh);
      setUserCode(savedSql || fresh?.starterSql || '');
    }
  }, [challenge.id]);

  // 2. Loading fallback: if activeChallenge is null, return Loading state
  if (!activeChallenge) {
    return (
      <div className="flex items-center justify-center p-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-mono text-sm shadow-xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-sky-400 animate-spin" />
          <span>Loading Challenge...</span>
        </div>
      </div>
    );
  }

  // 4. Random Challenge Handler: updates activeChallenge AND clears userCode to ''
  const handleRandomChallenge = () => {
    const randomPick = getRandomCodingChallenge(fullChallengeList);
    if (randomPick) {
      setActiveChallenge(randomPick);
      setUserCode(''); // Clear userCode so editor refreshes with new prompt
      setQueryResult(null);
      setValidationResult(null);
      setSelectedTableIndex(0);
      setUnlockedHints([]);
    }
  };

  const handleSelectChallenge = (ch: CodingChallenge) => {
    setActiveChallenge(ch);
    setUserCode(ch.starterSql || '');
    setQueryResult(null);
    setValidationResult(null);
    setSelectedTableIndex(0);
    setUnlockedHints([]);
  };

  // Reset to starter SQL
  const handleReset = () => {
    setUserCode(activeChallenge.starterSql || '');
    setQueryResult(null);
    setValidationResult(null);
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
      const result = await executeQuery(activeChallenge.schemaSql, userCode);
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
    setValidationResult(null);

    try {
      // Solutions are lazily retrieved on demand to prevent bundling all answers into initial script
      const targetSolution = activeChallenge.solutionSql || (await fetchChallengeSolution(activeChallenge.id));

      const result = await validateSolution(
        activeChallenge.schemaSql,
        userCode,
        targetSolution
      );

      setValidationResult(result);

      if (result.passed) {
        if (!completedChallengeIds.includes(activeChallenge.id)) {
          setCompletedChallengeIds([...completedChallengeIds, activeChallenge.id]);
        }
        onCodingComplete(userCode);

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    } catch (err: any) {
      setValidationResult({
        passed: false,
        message: err?.message || 'Validation error',
        userResult: {
          columns: [],
          values: [],
          error: err?.message || 'Validation error',
          rowCount: 0,
          executionTimeMs: 0,
        },
        expectedResult: {
          columns: [],
          values: [],
          rowCount: 0,
          executionTimeMs: 0,
        },
        mismatchReason: err?.message || 'Validation error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHint = (index: number) => {
    if (unlockedHints.includes(index)) {
      setUnlockedHints(unlockedHints.filter((i) => i !== index));
    } else {
      setUnlockedHints([...unlockedHints, index]);
    }
  };

  const handleCreateDynamicTheme = (themeKey: ScenarioTheme) => {
    const freshChallenge = generateLocalExercise('select', themeKey);
    setDynamicChallenges((prev) => [...prev, freshChallenge]);
    setActiveChallenge(freshChallenge);
    setUserCode(freshChallenge.starterSql || '');
    setShowThemeModal(false);
    setQueryResult(null);
    setValidationResult(null);
  };

  const currentTable = activeChallenge.tables[selectedTableIndex] || activeChallenge.tables[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Exercise Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Practice Exercises for this Topic ({fullChallengeList.length} scenarios):</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {fullChallengeList.map((ch, idx) => {
            const isDone = completedChallengeIds.includes(ch.id);
            const isSelected = activeChallenge.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
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

          {/* 4. Random Challenge Button: Pick random & clear userCode */}
          <button
            onClick={handleRandomChallenge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Randomly pick one challenge and clear the code editor"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
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
                <h3 className="text-base font-bold text-white">Generate Real-World SQL Scenario</h3>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select an industry domain to generate a realistic enterprise dataset, business schema, and SQL practice challenge:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {SCENARIO_THEMES.map((theme) => {
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleCreateDynamicTheme(theme.id)}
                    className="p-3 bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-left transition cursor-pointer group"
                  >
                    <div className="text-lg mb-1">{theme.icon}</div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                      {theme.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Instructions & Schema Tab (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'instructions'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Challenge</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'schema'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Tables ({activeChallenge.tables.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'hints'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hints ({activeChallenge.hints.length})</span>
            </button>
          </div>

          {/* Tab 1: Instructions & Problem Description */}
          {activeTab === 'instructions' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      Step 4: Interactive Sandbox
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        activeChallenge.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : activeChallenge.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {activeChallenge.difficulty}
                    </span>
                    {activeChallenge.source && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {activeChallenge.sourceId || activeChallenge.source}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{activeChallenge.title}</h3>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
                <span className="font-bold text-sky-400 block uppercase tracking-wider text-[10px]">
                  Task Requirement:
                </span>
                <p>{activeChallenge.instructions}</p>
              </div>

              {activeChallenge.expectedColumns && activeChallenge.expectedColumns.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Expected Columns in Output:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeChallenge.expectedColumns.map((col, idx) => (
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
                {activeChallenge.tables.map((t, idx) => (
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
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                          <tr>
                            {currentTable.columns.map((c, i) => (
                              <th key={i} className="p-2">
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
              {activeChallenge.hints.map((hint, idx) => {
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
                {/* Reveal Solution Button */}
                <button
                  onClick={async () => {
                    const sol = activeChallenge.solutionSql || (await fetchChallengeSolution(activeChallenge.id));
                    setUserCode(sol);
                  }}
                  className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary px-2.5 py-1 rounded-lg hover:bg-surface transition cursor-pointer"
                  title="Reveal model benchmark query"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Reveal Solution</span>
                </button>

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
                      userSql: userCode,
                      errorMessage: queryResult?.error,
                      mismatchDetails: validationResult?.mismatchReason,
                    })
                  }
                  className="flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-100 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>

            {/* 3. Fixed Height Parent Wrapper: Prevents editor from collapsing to 0px */}
            <div
              className="relative bg-slate-950"
              style={{ height: '400px', width: '100%', minHeight: '350px' }}
            >
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your SQL query here..."
                style={{ height: '100%', width: '100%', resize: 'none' }}
                className="w-full h-full p-4 bg-slate-950 text-sky-200 font-mono text-sm leading-relaxed outline-none border-none focus:ring-0 selection:bg-sky-500/30"
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
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                  <span>{isRunning ? 'Running...' : 'Run Query Preview'}</span>
                </button>
                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Final Solution'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Validation Result Banner (Pass / Fail) */}
          {validationResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                validationResult.passed
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {validationResult.passed ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300">Challenge Passed! Query output verified.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-300">Output mismatch. Inspect details below:</span>
                    </>
                  )}
                </div>

                {validationResult.passed && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onProceedToNextTopic}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md"
                    >
                      <span>Proceed to Next Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {!validationResult.passed && validationResult.mismatchReason && (
                <div className="p-3 bg-rose-950/50 rounded-xl border border-rose-500/20 font-mono text-[11px] text-rose-300">
                  {validationResult.mismatchReason}
                </div>
              )}
            </div>
          )}

          {/* Query Execution Result Grid */}
          {queryResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>Query Execution Result</span>
                  {queryResult.rowCount !== undefined && (
                    <span className="text-slate-400 text-[11px]">({queryResult.rowCount} rows)</span>
                  )}
                </div>
                {queryResult.executionTimeMs !== undefined && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{queryResult.executionTimeMs.toFixed(1)} ms</span>
                  </div>
                )}
              </div>

              {queryResult.error ? (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl font-mono text-xs text-rose-300">
                  ⚠️ {queryResult.error}
                </div>
              ) : queryResult.values.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-950/50 rounded-xl">
                  Query executed successfully, but returned 0 rows.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-300 font-mono sticky top-0 border-b border-slate-800 text-[11px]">
                      <tr>
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} className="p-2.5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-950/50 font-mono text-slate-300">
                      {queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/60">
                          {row.map((val: any, cIdx: number) => (
                            <td key={cIdx} className="p-2.5 truncate max-w-[160px]">
                              {val !== null && val !== undefined ? String(val) : <span className="text-slate-500">NULL</span>}
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
      </div>
    </div>
  );
};
