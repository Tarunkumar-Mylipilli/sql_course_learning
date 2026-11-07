import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  Table,
  Clock,
  Code2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingChallenge } from '../types';
import { INTERVIEW_50_QUESTIONS } from '../data/courseData';
import { executeQuery, validateSolution, QueryResult, ValidationResult } from '../lib/sqlEngine';

export const Interview50Hub: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentQ = INTERVIEW_50_QUESTIONS[selectedIdx] || INTERVIEW_50_QUESTIONS[0];

  // Editor starts completely empty so the student writes the code themselves
  const [userSql, setUserSql] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'prompt' | 'schema' | 'hints'>('prompt');

  const handleSelectQuestion = (index: number) => {
    setSelectedIdx(index);
    setUserSql('');
    setQueryResult(null);
    setValidationResult(null);
  };

  const handleRunQuery = async () => {
    setIsRunning(true);
    setValidationResult(null);
    try {
      const res = await executeQuery(currentQ.schemaSql, userSql);
      setQueryResult(res);
    } catch (err: any) {
      setQueryResult({
        columns: [],
        values: [],
        error: err?.message,
        rowCount: 0,
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validation = await validateSolution(
        currentQ.schemaSql,
        userSql,
        currentQ.solutionSql,
        currentQ.expectedColumns
      );
      setValidationResult(validation);
      if (validation.userResult) setQueryResult(validation.userResult);

      if (validation.passed) {
        if (!solvedIds.includes(currentQ.id)) {
          setSolvedIds([...solvedIds, currentQ.id]);
        }
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (_) {}
      }
    } catch (err: any) {
      setValidationResult({ passed: false, message: err?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" /> 50 SQL Interview Questions (Medium & Hard)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FAANG & LeetCode Advanced Practice Bank
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Derived from the most-solved LeetCode SQL 50, DataLemur FAANG challenges, StrataScratch, and Zachary Thomas's guide.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-semibold text-amber-400 self-start md:self-center">
          Solved: {solvedIds.length} / {INTERVIEW_50_QUESTIONS.length}
        </div>
      </div>

      {/* Main Grid: Left Question Sidebar + Right Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Question Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-2 max-h-[750px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Curated Questions
          </h3>
          {INTERVIEW_50_QUESTIONS.map((q, idx) => {
            const isSelected = selectedIdx === idx;
            const isSolved = solvedIds.includes(q.id);

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(idx)}
                className={`w-full p-3 rounded-2xl text-left transition flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/20 border border-sky-500/40 text-white'
                    : 'bg-slate-950/40 border border-slate-800/80 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSolved ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-400">{q.sourceId}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {q.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold truncate mt-0.5">{q.title}</h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workspace Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'prompt' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Task Prompt
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'schema' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Table Schema ({currentQ.tables.length})
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer ${
                activeTab === 'hints' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Interview Clue
            </button>
          </div>

          {activeTab === 'prompt' && (
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-sky-400 uppercase tracking-wider">{currentQ.title}</span>
              <p className="text-slate-200 text-sm leading-relaxed">{currentQ.instructions}</p>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Column</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentQ.tables[0]?.columns.map((c, i) => (
                    <tr key={i}>
                      <td className="p-2 text-sky-300">{c.name}</td>
                      <td className="p-2 text-slate-400">{c.type}</td>
                      <td className="p-2">{c.isPk ? 'PK' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'hints' && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-xs text-amber-200/90 font-mono">
              💡 {currentQ.hints.join(' | ')}
            </div>
          )}

          {/* Query Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Interview SQL Workspace</span>
              <button
                onClick={() => setUserSql(currentQ.starterSql)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <textarea
              rows={8}
              value={userSql}
              onChange={(e) => setUserSql(e.target.value)}
              className="w-full p-4 bg-slate-950 font-mono text-xs text-sky-200 outline-none resize-y"
            />
            <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Press Ctrl+Enter to run</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunQuery}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
                >
                  Run Query
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Test & Verify
                </button>
              </div>
            </div>
          </div>

          {/* Validation Banner */}
          {validationResult && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                validationResult.passed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {validationResult.message}
            </div>
          )}

          {/* Results Table */}
          {queryResult && queryResult.columns.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    {queryResult.columns.map((c, i) => (
                      <th key={i} className="p-2">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                  {queryResult.values.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className="p-2">
                          {cell === null ? 'NULL' : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
