import React, { useState } from 'react';

export const PreviewApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curriculum' | 'playground'>('dashboard');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT 1 AS demo;');
  const [hasExecuted, setHasExecuted] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-canvas text-content-primary font-sans flex flex-col">
      {/* Preview Mode Disclaimer Banner */}
      <aside
        role="status"
        aria-label="Preview Notice"
        className="w-full bg-accent-500/10 border-b border-accent-500/30 px-4 py-2.5 text-center text-xs font-medium text-accent-500 flex items-center justify-center gap-2"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
        <span>Preview Mode — Demo environment without authentication gate.</span>
        <a
          href="#/"
          className="ml-3 underline font-semibold text-content-primary hover:text-accent-500 transition-colors"
        >
          Return to Login
        </a>
      </aside>

      {/* Header */}
      <header className="border-b border-border-default bg-surface/80 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-600 text-white font-black flex items-center justify-center text-sm shadow-md">
            SQL
          </div>
          <div>
            <h1 className="text-sm font-bold text-content-primary">SQLMastery Preview</h1>
            <p className="text-[11px] text-content-muted">Interactive live demonstration</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav aria-label="Preview Tabs" className="flex items-center gap-1 bg-canvas p-1 rounded-xl border border-border-default">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-content-muted hover:text-content-primary'
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
            <section className="bg-surface border border-border-default rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-content-primary">Student Performance (Demo)</h2>
                <p className="text-xs text-content-muted">Sample metrics showcase how active learning tracks across SQL units.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-1">
                  <div className="text-xs text-content-muted font-medium">Completed Exercises</div>
                  <div className="text-2xl font-bold text-content-primary">14 / 20</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">70% Mastered</div>
                </div>
                <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-1">
                  <div className="text-xs text-content-muted font-medium">Current Streak</div>
                  <div className="text-2xl font-bold text-content-primary">5 Days</div>
                  <div className="text-[11px] text-accent-500 font-semibold">On Fire</div>
                </div>
                <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-1">
                  <div className="text-xs text-content-muted font-medium">Average Quiz Score</div>
                  <div className="text-2xl font-bold text-content-primary">92%</div>
                  <div className="text-[11px] text-content-muted">Across 8 Quizzes</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-content-primary">Structured Learning Path</h2>
            <div className="space-y-3">
              {[
                { id: 1, title: 'Introduction to SELECT & Basic Filtering', level: 'Beginner', steps: '4/4 Completed' },
                { id: 2, title: 'Multi-Table Queries with INNER & LEFT JOIN', level: 'Intermediate', steps: '3/4 Completed' },
                { id: 3, title: 'Aggregation, GROUP BY, and HAVING', level: 'Intermediate', steps: '2/4 Completed' },
                { id: 4, title: 'Advanced Window Functions & CTEs', level: 'Advanced', steps: '0/4 Pending' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-border-default rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-content-primary">{item.id}. {item.title}</div>
                    <div className="flex items-center gap-2 text-[11px] text-content-muted">
                      <span className="px-2 py-0.5 rounded bg-canvas border border-border-subtle font-medium text-accent-500">
                        {item.level}
                      </span>
                      <span>•</span>
                      <span>{item.steps}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-accent-500">Demo Ready</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-4">
            <div className="bg-surface border border-border-default rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-content-primary uppercase tracking-wider">SQL Sandbox Editor</h2>
                <button
                  onClick={() => setHasExecuted(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-accent-600 text-white font-bold text-xs hover:bg-accent-700 transition cursor-pointer shadow-sm"
                >
                  Run Query
                </button>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs p-3 rounded-xl bg-canvas text-content-primary border border-border-default outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              />

              {hasExecuted && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-content-muted">Query Results (1 row):</div>
                  <div className="overflow-x-auto rounded-xl border border-border-default">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-canvas text-content-secondary border-b border-border-default">
                        <tr>
                          <th className="p-2.5">demo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-surface">
                        <tr>
                          <td className="p-2.5 text-accent-500 font-semibold">1</td>
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
