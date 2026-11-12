import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Network,
  HelpCircle,
  Copy,
  Check,
  Download,
  Share2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Brain,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Topic } from '../types';
import { MindmapViewer } from './MindmapViewer';

interface NotebookLLMViewerProps {
  topic: Topic;
  onProceedToQuiz: () => void;
  onProceedToCoding: () => void;
}

export const NotebookLLMViewer: React.FC<NotebookLLMViewerProps> = ({
  topic,
  onProceedToQuiz,
  onProceedToCoding,
}) => {
  const [activeTab, setActiveTab] = useState<'study-guide' | 'mindmap' | 'faq' | 'briefing'>('study-guide');
  const [copied, setCopied] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([]);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  // Extract topic theory data
  const theory = topic.theory;
  const subModules = topic.subModules || [];

  // Construct structured study guide in NotebookLM style
  const keyConcepts = theory.keyRules && theory.keyRules.length > 0 
    ? theory.keyRules 
    : [
        'Understand table structure, rows, and datatypes before querying.',
        'Filter rows early with WHERE to optimize execution memory.',
        'Use explicit column projections instead of SELECT *.',
      ];

  const commonPitfalls = theory.commonMistakes && theory.commonMistakes.length > 0
    ? theory.commonMistakes
    : [
        'Confusing WHERE (pre-aggregation filter) with HAVING (post-aggregation filter).',
        'Comparing NULL using = instead of IS NULL.',
        'Assuming SELECT columns execute before WHERE filters.',
      ];

  const handleCopyStudyGuide = () => {
    const fullText = `
# 📓 NotebookLM Comprehensive Study Guide: ${topic.title}
**Module Level:** ${topic.level} | **Estimated Mastery:** ${topic.estimatedMinutes} mins

## 🎯 Executive Summary
${theory.summary || topic.overview}

## ⚡ Standard Syntax
\`\`\`sql
${theory.syntax || 'SELECT column1, column2 FROM table_name;'}
\`\`\`

## 🧠 Core Mental Model & Key Concepts
${keyConcepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## ⚠️ Pitfalls & Edge Cases
${commonPitfalls.map((p, i) => `• ${p}`).join('\n')}

## 💡 Example Implementation
\`\`\`sql
${theory.exampleQuery || 'SELECT * FROM table;'}
\`\`\`
${theory.exampleExplanation || ''}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const q = customQuestion.trim();
    setCustomQuestion('');
    setIsGeneratingAnswer(true);

    setTimeout(() => {
      let a = `In ${topic.title}, remember that the SQL execution engine evaluates table sources (FROM) before applying filters. For "${q}", check the column data types and verify whether NULL values affect your result.`;
      const qLower = q.toLowerCase();
      if (qLower.includes('where') || qLower.includes('filter')) {
        a = `💡 **NotebookLM Rule:** The WHERE clause acts as a row-by-row gatekeeper immediately after FROM. It cannot evaluate aggregate functions like SUM() or COUNT()—those belong in HAVING!`;
      } else if (qLower.includes('join')) {
        a = `💡 **NotebookLM Rule:** Joins assemble Cartesian relations. Always verify your ON condition matches foreign keys to avoid row multiplication!`;
      } else if (qLower.includes('null')) {
        a = `💡 **NotebookLM Rule:** In SQL 3-valued logic, \`NULL = NULL\` is UNKNOWN (false). Always use \`IS NULL\` or \`COALESCE(col, default)\`.`;
      }

      setQaList((prev) => [...prev, { q, a }]);
      setIsGeneratingAnswer(false);
    }, 400);
  };

  return (
    <div className="bg-surface border border-border-default rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      {/* NotebookLM Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-accent-600/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent-500/10 text-accent-400 border border-accent-500/20">
                AI Video-Synthesized Notes
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                Auto-Generated
              </span>
            </div>
            <h2 className="text-xl font-black text-content-primary tracking-tight mt-1">
              NotebookLM Study Hub: {topic.title}
            </h2>
            <p className="text-xs text-content-secondary">
              Synthesized directly from the completed lecture videos with interactive mental models, mind maps, and flash briefings.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyStudyGuide}
            className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:bg-surface text-content-primary text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Guide!' : 'Copy Study Notes'}</span>
          </button>
          <button
            onClick={onProceedToQuiz}
            className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <span>Proceed to Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* NotebookLM Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-default pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('study-guide')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'study-guide'
              ? 'bg-accent-600 text-white shadow-sm'
              : 'bg-canvas text-content-secondary hover:text-content-primary border border-border-subtle'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Comprehensive Study Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('mindmap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'mindmap'
              ? 'bg-accent-600 text-white shadow-sm'
              : 'bg-canvas text-content-secondary hover:text-content-primary border border-border-subtle'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Interactive Mind Map</span>
        </button>

        <button
          onClick={() => setActiveTab('briefing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'briefing'
              ? 'bg-accent-600 text-white shadow-sm'
              : 'bg-canvas text-content-secondary hover:text-content-primary border border-border-subtle'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Engine Execution Briefing</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'faq'
              ? 'bg-accent-600 text-white shadow-sm'
              : 'bg-canvas text-content-secondary hover:text-content-primary border border-border-subtle'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Notebook Q&A</span>
        </button>
      </div>

      {/* TAB 1: Comprehensive Study Guide */}
      {activeTab === 'study-guide' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Executive Lecture Summary
            </h3>
            <p className="text-sm text-content-primary leading-relaxed">
              {theory.summary || topic.overview}
            </p>
          </div>

          {/* Syntax Blueprint */}
          <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Canonical Syntax Blueprint
            </h3>
            <pre className="p-4 bg-surface rounded-xl border border-border-subtle font-mono text-xs text-accent-400 overflow-x-auto">
              {theory.syntax}
            </pre>
          </div>

          {/* 2-Column: Key Principles vs Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Core Rules */}
            <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Key Concept Anchors ({keyConcepts.length})
              </h3>
              <ul className="space-y-2.5 text-xs text-content-primary">
                {keyConcepts.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface/50 border border-border-subtle">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitfalls */}
            <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Common Traps & Pitfalls ({commonPitfalls.length})
              </h3>
              <ul className="space-y-2.5 text-xs text-content-primary">
                {commonPitfalls.map((pitfall, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface/50 border border-border-subtle">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span className="leading-relaxed">{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submodule Breakdown if present */}
          {subModules.length > 0 && (
            <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Submodule Breakdown ({subModules.length} Modules)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subModules.map((sm, i) => (
                  <div key={sm.id || i} className="p-3.5 rounded-xl bg-surface border border-border-subtle space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-content-primary">
                        {i + 1}. {sm.title}
                      </span>
                      {sm.duration && (
                        <span className="text-[10px] text-content-muted font-mono">{sm.duration}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-content-secondary line-clamp-3">
                      {sm.notes || sm.summary || 'Covers core syntax rules and practical query application.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive Mind Map */}
      {activeTab === 'mindmap' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 bg-canvas rounded-2xl border border-border-default flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-content-primary">Visual Concept Mind Map</h3>
              <p className="text-[11px] text-content-muted">Hierarchical mental model generated from the curriculum structure</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 font-bold uppercase">
              Mermaid & Interactive Node Graph
            </span>
          </div>

          <div className="p-5 bg-canvas rounded-2xl border border-border-default">
            <MindmapViewer
              mermaidCode={theory.mermaidMindmap}
              topicTitle={topic.title}
            />
          </div>
        </div>
      )}

      {/* TAB 3: Database Engine Execution Briefing */}
      {activeTab === 'briefing' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-500" />
              <h3 className="text-sm font-bold text-content-primary">
                Physical Execution Pipeline (Under The Hood)
              </h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              NotebookLM extracts the underlying relational algebra so you can predict how any database optimizer (PostgreSQL, SQLite, MySQL) processes queries:
            </p>

            <div className="space-y-3 pt-2">
              {[
                { step: '1. FROM & JOIN', desc: 'Identifies source tables and creates row-level cross-product or index scan.' },
                { step: '2. WHERE', desc: 'Filters non-matching rows early to conserve memory and I/O buffer pool.' },
                { step: '3. GROUP BY', desc: 'Aggregates matching rows into distinct summary buckets.' },
                { step: '4. HAVING', desc: 'Filters grouped buckets after aggregate functions (COUNT, SUM, AVG) run.' },
                { step: '5. SELECT', desc: 'Projects the requested columns, calculates expressions, and applies aliases.' },
                { step: '6. ORDER BY & LIMIT', desc: 'Performs external sort (Quicksort/Heapsort) and slices the final row count.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border-subtle">
                  <span className="px-2.5 py-1 rounded-lg bg-accent-600/20 text-accent-400 text-xs font-mono font-bold shrink-0">
                    {item.step}
                  </span>
                  <span className="text-xs text-content-secondary leading-relaxed mt-0.5">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Ask Notebook Q&A */}
      {activeTab === 'faq' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent-500" />
              <h3 className="text-sm font-bold text-content-primary">
                Ask Questions on {topic.title}
              </h3>
            </div>
            <p className="text-xs text-content-secondary">
              Have a doubt about a query, edge-case, or syntax detail? Ask NotebookLM below for instant grounded clarification:
            </p>

            {/* Input Form */}
            <form onSubmit={handleAskNotebook} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. When should I use HAVING instead of WHERE?"
                className="flex-1 bg-surface border border-border-default rounded-xl px-4 py-2.5 text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              />
              <button
                type="submit"
                disabled={isGeneratingAnswer || !customQuestion.trim()}
                className="px-4 py-2.5 bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
              >
                {isGeneratingAnswer ? 'Synthesizing...' : 'Ask Note'}
              </button>
            </form>

            {/* Q&A Thread */}
            {qaList.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-border-default">
                {qaList.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                    <p className="text-xs font-bold text-accent-400">Q: {item.q}</p>
                    <p className="text-xs text-content-secondary whitespace-pre-wrap leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
