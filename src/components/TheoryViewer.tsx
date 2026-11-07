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
  Download,
  Bookmark,
  Printer,
} from 'lucide-react';
import { TopicTheory } from '../types';
import { MindmapViewer } from './MindmapViewer';

interface TheoryViewerProps {
  theory: TopicTheory;
  subModules?: import('../types').SubModule[];
  isRead: boolean;
  onMarkRead: () => void;
  onProceedToQuiz: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({
  theory,
  subModules = [],
  isRead,
  onMarkRead,
  onProceedToQuiz,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'points' | 'submodules' | 'mindmap' | 'execution' | 'pitfalls' | 'enterprise'>(
    subModules && subModules.length > 0 && subModules.some(s => s.notes) ? 'submodules' : 'points'
  );
  const [reviewedPoints, setReviewedPoints] = useState<number[]>([]);
  const [selectedSubmoduleIndex, setSelectedSubmoduleIndex] = useState<number>(0);

  const handleDownloadNotes = () => {
    let md = `# ${theory.title}\n\n`;
    md += `## Summary\n${theory.summary}\n\n`;
    md += `## Syntax\n\`\`\`sql\n${theory.syntax}\n\`\`\`\n\n`;
    md += `## Key Architectural Rules & Concepts\n`;
    theory.keyRules.forEach((r, i) => {
      md += `${i + 1}. ${r}\n`;
    });
    md += `\n## Core Lesson Points\n`;
    theory.explanation.forEach((p, i) => {
      md += `* **Point ${i + 1}:** ${p}\n`;
    });
    md += `\n## Real-World Enterprise Example\n\`\`\`sql\n${theory.exampleQuery}\n\`\`\`\n${theory.exampleExplanation}\n\n`;
    md += `## Common Traps & Mistakes\n`;
    theory.commonMistakes.forEach((m, i) => {
      md += `${i + 1}. ${m}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintNotes = () => {
    window.print();
  };

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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Step 2: Website Theory & Point-to-Point Notes
            </span>
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 transition cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Bookmark this lesson"
              >
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            )}
            <button
              onClick={handleDownloadNotes}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 flex items-center gap-1 transition cursor-pointer"
              title="Download Notes as Markdown"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>Download (.md)</span>
            </button>
            <button
              onClick={handlePrintNotes}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 flex items-center gap-1 transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3 h-3 text-slate-400" />
              <span>Print / PDF</span>
            </button>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{theory.title}</h2>
          <p className="text-sm text-slate-300 mt-1">{theory.summary}</p>
        </div>

        {isRead ? (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold self-start md:self-center shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Theory Mastered</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-medium self-start md:self-center shrink-0">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <span>Review all points to unlock Quiz</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl flex-wrap">
        {subModules && subModules.length > 0 && (
          <button
            onClick={() => setActiveTab('submodules')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'submodules'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Submodule Notes ({subModules.length})</span>
          </button>
        )}

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

      {/* TAB 0: Submodule Specific Theory Notes */}
      {activeTab === 'submodules' && subModules && subModules.length > 0 && (
        <div className="space-y-4">
          {/* Submodule Navigation Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subModules.map((sm, smIdx) => (
              <button
                key={sm.id || smIdx}
                onClick={() => setSelectedSubmoduleIndex(smIdx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  selectedSubmoduleIndex === smIdx
                    ? 'bg-cyan-950/70 border border-cyan-500/60 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                  {smIdx + 1}
                </span>
                <span>{sm.title}</span>
                {sm.duration && <span className="text-[10px] text-slate-500 font-mono">({sm.duration})</span>}
              </button>
            ))}
          </div>

          {/* Submodule Notes Content Card */}
          {(() => {
            const currentSub = subModules[selectedSubmoduleIndex] || subModules[0];
            const notesText = currentSub.notes || currentSub.summary || 'Detailed theory notes, syntax rules, and examples for this submodule.';
            return (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Submodule Notes</span>
                    <h3 className="text-base font-extrabold text-white mt-0.5">{currentSub.title}</h3>
                  </div>
                  {currentSub.duration && (
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                      ~{currentSub.duration}
                    </span>
                  )}
                </div>

                <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-3 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl">
                  {notesText}
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
