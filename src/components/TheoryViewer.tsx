import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Code2,
  Workflow,
  Sparkles,
  ShieldAlert,
  Building2,
  ListOrdered,
} from 'lucide-react';
import { TopicTheory } from '../types';
import { MindmapViewer } from './MindmapViewer';

interface TheoryViewerProps {
  theory: TopicTheory;
  isRead: boolean;
  onMarkRead: () => void;
  onProceedToQuiz: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({
  theory,
  isRead,
  onMarkRead,
  onProceedToQuiz,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'points' | 'mindmap' | 'execution' | 'pitfalls' | 'enterprise'>('points');
  const [reviewedPoints, setReviewedPoints] = useState<number[]>([]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePoint = (index: number) => {
    if (reviewedPoints.includes(index)) {
      setReviewedPoints(reviewedPoints.filter((i) => i !== index));
    } else {
      setReviewedPoints([...reviewedPoints, index]);
    }
  };

  // Execution flow pipeline for SQL queries
  const executionOrderSteps = [
    { step: 1, clause: 'FROM & JOIN', desc: 'Identify target tables, evaluate Cartesian products and merge relations' },
    { step: 2, clause: 'WHERE', desc: 'Filter out individual raw rows before any aggregation takes place' },
    { step: 3, clause: 'GROUP BY', desc: 'Collapse matching rows into aggregated summary buckets' },
    { step: 4, clause: 'HAVING', desc: 'Filter aggregated groups based on summary functions (COUNT, SUM, AVG)' },
    { step: 5, clause: 'SELECT', desc: 'Evaluate column projections, expressions, calculations, and assign aliases' },
    { step: 6, clause: 'DISTINCT', desc: 'Eliminate duplicate rows across projected columns' },
    { step: 7, clause: 'ORDER BY', desc: 'Sort finalized rows by specified columns ASC or DESC' },
    { step: 8, clause: 'LIMIT / OFFSET', desc: 'Slice the final result set for pagination' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Step 2: Website Theory & Point-to-Point Notes
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{theory.title}</h2>
          <p className="text-sm text-slate-300 mt-1">{theory.summary}</p>
        </div>

        {isRead ? (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold self-start md:self-center">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Theory Mastered</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-medium self-start md:self-center">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <span>Review all points to unlock Quiz</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl flex-wrap">
        <button
          onClick={() => setActiveTab('points')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'points'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Point-to-Point Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('mindmap')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mindmap'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mermaid Mindmap</span>
        </button>

        <button
          onClick={() => setActiveTab('execution')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'execution'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Execution Order Mental Model</span>
        </button>

        <button
          onClick={() => setActiveTab('pitfalls')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pitfalls'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Interview Traps & Pitfalls</span>
        </button>

        <button
          onClick={() => setActiveTab('enterprise')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'enterprise'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Enterprise Real Scenario</span>
        </button>
      </div>

      {/* Syntax Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Formal SQL Syntax Specification</span>
          </div>
          <button
            onClick={() => handleCopy(theory.syntax)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-md cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Syntax'}</span>
          </button>
        </div>
        <pre className="p-4 text-sm text-sky-300 font-mono overflow-x-auto bg-slate-950/80 leading-relaxed">
          <code>{theory.syntax}</code>
        </pre>
      </div>

      {/* TAB 1: Point-to-Point Detailed Explanation */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Point-by-Point Comprehensive Breakdown</span>
              </h3>
              <span className="text-xs text-slate-400">Click points to mark as reviewed</span>
            </div>

            <div className="space-y-3">
              {theory.explanation.map((para, i) => {
                const isChecked = reviewedPoints.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => togglePoint(i)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition cursor-pointer ${
                      isChecked
                        ? 'bg-sky-500/10 border-sky-500/40 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isChecked
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : i + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-relaxed">{para}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Rules Grid */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Production Best Practices & Golden Rules</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {theory.keyRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start gap-2"
                >
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Mermaid Mindmap */}
      {activeTab === 'mindmap' && (
        <MindmapViewer
          mermaidCode={theory.mermaidMindmap}
          topicTitle={theory.title}
        />
      )}

      {/* TAB 2: Execution Order Mental Model */}
      {activeTab === 'execution' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Workflow className="w-4 h-4 text-amber-400" />
              <span>Database Engine Logical Query Processing Order</span>
            </h3>
            <p className="text-xs text-slate-400">
              Unlike code written top-to-bottom, the SQL engine processes clauses in this exact pipeline order:
            </p>
          </div>

          <div className="space-y-2.5">
            {executionOrderSteps.map((s) => (
              <div
                key={s.step}
                className="flex items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800"
              >
                <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <span className="font-mono text-xs font-bold text-sky-300 w-28 shrink-0">{s.clause}</span>
                <span className="text-xs text-slate-300">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Interview Traps & Pitfalls */}
      {activeTab === 'pitfalls' && (
        <div className="bg-rose-950/10 border border-rose-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Frequent Interview Traps & Beginner Mistakes</span>
          </div>
          <div className="space-y-3">
            {theory.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="bg-rose-950/30 p-4 rounded-xl border border-rose-500/20 text-xs text-rose-200/90 flex items-start gap-3"
              >
                <span className="text-rose-400 font-bold shrink-0 text-sm">⚠️ Trap #{idx + 1}:</span>
                <span className="leading-relaxed">{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Enterprise Production Scenario */}
      {activeTab === 'enterprise' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Real-World Enterprise Example & Output Analysis</span>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-sky-300">
            <code>{theory.exampleQuery}</code>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-slate-100 block">Why this matters in production:</span>
            <p>{theory.exampleExplanation}</p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-400">
          Reviewed the point-to-point notes? Click below to confirm and start the Step 3 Mastery Quiz.
        </p>
        <button
          onClick={() => {
            onMarkRead();
            onProceedToQuiz();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Notes as Studied & Proceed to Step 3: Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
