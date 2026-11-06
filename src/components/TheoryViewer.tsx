import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Copy, Check, AlertTriangle, Lightbulb, Code2 } from 'lucide-react';
import { TopicTheory } from '../types';

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Step 2: Website Theory & Syntax
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
            <span>Read thoroughly to pass Quiz</span>
          </div>
        )}
      </div>

      {/* Syntax Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>SQL Syntax Pattern</span>
          </div>
          <button
            onClick={() => handleCopy(theory.syntax)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-md cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="p-4 text-sm text-sky-300 font-mono overflow-x-auto bg-slate-950/80 leading-relaxed">
          <code>{theory.syntax}</code>
        </pre>
      </div>

      {/* Deep Dive Concept Cards */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Detailed Explanation & Mental Models</span>
        </h3>
        <div className="space-y-3">
          {theory.explanation.map((para, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 text-sm text-slate-300 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-sky-400 mt-2 shrink-0" />
              <span>{para}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules vs Common Pitfalls Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Rules */}
        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Best Practices & Golden Rules</span>
          </div>
          <ul className="space-y-2.5 text-xs text-emerald-200/90">
            {theory.keyRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/10">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Pitfalls */}
        <div className="bg-rose-950/10 border border-rose-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Pitfalls to Avoid</span>
          </div>
          <ul className="space-y-2.5 text-xs text-rose-200/90">
            {theory.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/10">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Production Example Query */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Practical Example in Action
        </h4>
        <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 border border-slate-800/80 overflow-x-auto">
          <code>{theory.exampleQuery}</code>
        </pre>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          💡 {theory.exampleExplanation}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-400">
          Ready to verify your understanding? The quiz requires a passing score to unlock the coding challenge.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isRead ? (
            <button
              onClick={() => {
                onMarkRead();
                onProceedToQuiz();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Theory Read & Proceed to Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onProceedToQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition cursor-pointer"
            >
              <span>Proceed to Step 3: Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
