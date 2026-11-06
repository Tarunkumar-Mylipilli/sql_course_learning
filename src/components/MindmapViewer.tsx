import React, { useState, useEffect, useRef } from 'react';
import { Network, Copy, Check, Sparkles, Layers, Code } from 'lucide-react';

interface MindmapViewerProps {
  mermaidCode?: string;
  topicTitle: string;
}

interface MindmapNode {
  title: string;
  children: string[];
}

export const MindmapViewer: React.FC<MindmapViewerProps> = ({
  mermaidCode,
  topicTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'mermaid'>('visual');
  const [activeBranch, setActiveBranch] = useState<number | null>(null);

  // Parse mermaid mindmap text into structured branches
  const parseMermaidMindmap = (code?: string): { root: string; branches: MindmapNode[] } => {
    if (!code) {
      return {
        root: topicTitle,
        branches: [
          { title: 'Core Syntax', children: ['SELECT clause', 'FROM clause', 'Expression projections'] },
          { title: 'Best Practices', children: ['Avoid SELECT *', 'Use column aliases', 'Case conventions'] },
          { title: 'Execution Engine', children: ['FROM executes first', 'SELECT projects output'] },
        ],
      };
    }

    const lines = code.split('\n');
    let root = topicTitle;
    const branches: MindmapNode[] = [];
    let currentBranch: MindmapNode | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('mindmap')) continue;

      if (line.includes('root((')) {
        const match = line.match(/root\(\((.*?)\)\)/);
        if (match && match[1]) {
          root = match[1];
        }
        continue;
      }

      // Check indentation depth
      const indent = rawLine.search(/\S/);
      if (indent === 4) {
        // Level 1 branch
        currentBranch = { title: line.replace(/[()]/g, ''), children: [] };
        branches.push(currentBranch);
      } else if (indent >= 6 && currentBranch) {
        // Level 2 leaf
        currentBranch.children.push(line.replace(/[()]/g, ''));
      }
    }

    if (branches.length === 0) {
      return {
        root: topicTitle,
        branches: [
          { title: 'Foundations', children: ['SELECT syntax', 'FROM target table'] },
          { title: 'Column Expressions', children: ['Arithmetic calculations', 'String literals', 'AS aliases'] },
        ],
      };
    }

    return { root, branches };
  };

  const { root, branches } = parseMermaidMindmap(mermaidCode);

  const handleCopy = () => {
    if (!mermaidCode) return;
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const branchColors = [
    { border: 'border-sky-500/40', bg: 'bg-sky-500/10', text: 'text-sky-300', dot: 'bg-sky-400', glow: 'shadow-sky-500/10' },
    { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-300', dot: 'bg-indigo-400', glow: 'shadow-indigo-500/10' },
    { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-amber-500/10' },
    { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/10' },
    { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-purple-500/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Visual Mindmap & Knowledge Graph</h3>
            <p className="text-xs text-slate-400">Interactive concept hierarchy and database mental model</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'visual'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setViewMode('mermaid')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mermaid'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mermaid.js Code</span>
            </button>
          </div>

          {mermaidCode && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Graph View */}
      {viewMode === 'visual' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-8 overflow-hidden relative">
          {/* Background subtle radial gradient */}
          <div className="absolute inset-0 bg-radial from-sky-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Central Root Node */}
          <div className="flex flex-col items-center justify-center text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-sky-400/50 shadow-xl shadow-sky-500/10">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span className="text-base font-extrabold text-white tracking-wide">{root}</span>
            </div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-sky-400/60 to-slate-700 my-1" />
          </div>

          {/* Branch Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {branches.map((branch, idx) => {
              const color = branchColors[idx % branchColors.length];
              const isSelected = activeBranch === idx || activeBranch === null;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveBranch(idx)}
                  onMouseLeave={() => setActiveBranch(null)}
                  className={`rounded-xl border ${color.border} ${color.bg} p-4 transition-all duration-300 ${
                    isSelected ? 'opacity-100 scale-[1.02] shadow-lg ' + color.glow : 'opacity-70 scale-100'
                  }`}
                >
                  {/* Branch Title */}
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot} shrink-0 animate-ping`} />
                    <h4 className={`text-sm font-bold ${color.text} tracking-wide`}>
                      {branch.title}
                    </h4>
                  </div>

                  {/* Leaf Nodes */}
                  <ul className="space-y-2">
                    {branch.children.map((child, cIdx) => (
                      <li
                        key={cIdx}
                        className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-slate-500 mt-0.5">•</span>
                        <span>{child}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-500 italic pt-2">
            Tip: Hover over any branch to highlight related concepts in the architecture.
          </div>
        </div>
      )}

      {/* Raw Mermaid Syntax View */}
      {viewMode === 'mermaid' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Mermaid.js Diagram Syntax (Compatible with GitHub Markdown & Mermaid Live)</span>
          </div>
          <pre className="p-5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed bg-slate-950">
            <code>{mermaidCode || 'No mindmap syntax provided.'}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
