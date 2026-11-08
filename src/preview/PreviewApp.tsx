import React, { useState } from 'react';

export const PreviewApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curriculum' | 'playground'>('dashboard');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT 1 AS demo;');
  const [hasExecuted, setHasExecuted] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-canvas text-fg-default font-sans flex flex-col">
      {/* Preview Mode Disclaimer Banner */}
      <aside
        role="status"
        aria-label="Preview Notice"
        className="w-full bg-accent-muted/30 border-b border-accent-subtle px-4 py-2.5 text-center text-xs font-medium text-accent flex items-center justify-center gap-2"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span>Preview — demo data, nothing is saved.</span>
        <a
          href="#/"
          className="ml-3 underline font-semibold hover:text-fg-default transition-colors"
        >
          Return to Login
        </a>
      </aside>

      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent text-slate-950 font-black flex items-center justify-center text-sm">
            SQL
          </div>
          <div>
            <h1 className="text-sm font-semibold text-fg-default">SQLMastery Preview</h1>
            <p className="text-[11px] text-fg-muted">Interactive demo environment</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav aria-label="Preview Tabs" className="flex items-center gap-1 bg-surface-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-card text-fg-default shadow-sm border border-border'
                : 'text-fg-muted hover:text-fg-default'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-card text-fg-default shadow-sm border border-border'
                : 'text-fg-muted hover:text-fg-default'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-card text-fg-default shadow-sm border border-border'
                : 'text-fg-muted hover:text-fg-default'
            }`}
          >
            Playground
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-fg-default mb-1">Student Performance (Demo)</h2>
              <p className="text-xs text-fg-muted mb-4">Sample metrics showcase how active learning tracks across SQL units.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <div className="text-xs text-fg-muted font-medium">Completed Exercises</div>
                  <div className="text-2xl font-bold text-fg-default mt-1">14 / 20</div>
                  <div className="text-[11px] text-success font-medium mt-1">70% Mastered</div>
                </div>
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <div className="text-xs text-fg-muted font-medium">Current Streak</div>
                  <div className="text-2xl font-bold text-fg-default mt-1">5 Days</div>
                  <div className="text-[11px] text-accent font-medium mt-1">On Fire</div>
                </div>
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <div className="text-xs text-fg-muted font-medium">Average Quiz Score</div>
                  <div className="text-2xl font-bold text-fg-default mt-1">92%</div>
                  <div className="text-[11px] text-fg-muted mt-1">Across 8 Quizzes</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-fg-default">Structured Learning Path</h2>
            <div className="space-y-3">
              {[
                { id: 1, title: 'Introduction to SELECT & Basic Filtering', level: 'Beginner', steps: '4/4 Completed' },
                { id: 2, title: 'Multi-Table Queries with INNER & LEFT JOIN', level: 'Intermediate', steps: '3/4 Completed' },
                { id: 3, title: 'Aggregation, GROUP BY, and HAVING', level: 'Intermediate', steps: '2/4 Completed' },
                { id: 4, title: 'Advanced Window Functions & CTEs', level: 'Advanced', steps: '0/4 Pending' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-fg-default">{item.id}. {item.title}</div>
                    <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                      <span className="px-2 py-0.5 rounded bg-surface border border-border font-medium">
                        {item.level}
                      </span>
                      <span>•</span>
                      <span>{item.steps}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-accent">Demo Ready</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-fg-default uppercase tracking-wider">SQL Sandbox Editor</h2>
                <button
                  onClick={() => setHasExecuted(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-accent text-slate-950 font-semibold text-xs hover:opacity-90 transition cursor-pointer"
                >
                  Run Query
                </button>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs p-3 rounded-lg bg-canvas text-accent border border-border outline-none focus:border-accent"
              />

              {hasExecuted && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-fg-muted">Query Results (1 row):</div>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-surface text-fg-muted border-b border-border">
                        <tr>
                          <th className="p-2.5">demo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card">
                        <tr>
                          <td className="p-2.5 text-accent font-semibold">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewApp;
