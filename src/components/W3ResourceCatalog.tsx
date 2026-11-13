import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Cpu,
  Users,
  Film,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Filter,
} from 'lucide-react';
import {
  W3RESOURCE_MASTER_CATALOG,
  W3Track,
  W3Subtrack,
} from '../data/modules/w3resourceMasterCatalog';

interface W3ResourceCatalogProps {
  onNavigateToPractice?: () => void;
  onOpenAITutorWithPrompt?: (prompt: string) => void;
}

export const W3ResourceCatalog: React.FC<W3ResourceCatalogProps> = ({
  onNavigateToPractice,
  onOpenAITutorWithPrompt,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(W3RESOURCE_MASTER_CATALOG[0].id);
  const [selectedSubtrackId, setSelectedSubtrackId] = useState<string>(
    W3RESOURCE_MASTER_CATALOG[0].subtracks[0].id
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const selectedTrack =
    W3RESOURCE_MASTER_CATALOG.find((t) => t.id === selectedTrackId) || W3RESOURCE_MASTER_CATALOG[0];

  const currentSubtrack =
    selectedTrack.subtracks.find((st) => st.id === selectedSubtrackId) || selectedTrack.subtracks[0];

  // Global search filtering across all 28 modules
  const allSubtracks = W3RESOURCE_MASTER_CATALOG.flatMap((t) =>
    t.subtracks.map((st) => ({ ...st, trackName: t.name, trackId: t.id }))
  );

  const filteredSubtracks = allSubtracks.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = difficultyFilter === 'All' ? true : st.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-accent-500" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-success-500" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-warning-500" />;
      case 'Users':
        return <Users className="w-4 h-4 text-info-500" />;
      case 'Film':
        return <Film className="w-4 h-4 text-accent-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-danger-500" />;
      default:
        return <Database className="w-4 h-4 text-accent-500" />;
    }
  };

  const getDifficultyBadge = (diff: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (diff) {
      case 'Beginner':
        return 'bg-success-500/10 text-success-500 border-success-500/20';
      case 'Intermediate':
        return 'bg-warning-500/10 text-warning-500 border-warning-500/20';
      case 'Advanced':
        return 'bg-danger-500/10 text-danger-500 border-danger-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 font-ui">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="bg-surface border border-border-default rounded-xl p-6 relative overflow-hidden shadow-e1">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-500 border border-accent-500/20">
                <Database className="w-3.5 h-3.5" />
                <span>W3Resource Complete Catalog • 28 Modules • 1,856 Exercises</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
                W3Resource SQL Practice Suite
              </h1>
              <p className="text-sm text-content-secondary max-w-2xl leading-relaxed">
                Explore the complete official curriculum from{' '}
                <a
                  href="https://www.w3resource.com/sql-exercises/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-500 hover:underline font-semibold"
                >
                  w3resource.com/sql-exercises
                </a>
                . Practice live in the interactive SQL Sandbox or review structured blueprints with canonical queries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onNavigateToPractice && (
                <button
                  onClick={onNavigateToPractice}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-e2 transition-all cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Launch Practice Arena (40 Live Tasks)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtle" />
            <input
              type="text"
              placeholder="Search 28 modules, concepts, clauses (e.g. JOIN, HAVING, DDL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border-default text-xs text-content-primary placeholder:text-content-subtle focus:outline-none focus:border-accent-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-medium text-content-subtle flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Level:</span>
            </span>
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-surface border-border-default text-content-secondary hover:text-content-primary'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Global Search Results Mode */}
        {searchQuery.trim() !== '' ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-content-secondary">
              Found {filteredSubtracks.length} module(s) matching &quot;{searchQuery}&quot;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubtracks.map((st) => (
                <div
                  key={`${st.trackId}-${st.id}`}
                  className="bg-surface border border-border-default hover:border-accent-500/50 rounded-xl p-5 flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-500">
                        {st.trackName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                          st.difficulty
                        )}`}
                      >
                        {st.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-content-primary group-hover:text-accent-500 transition-colors">
                      {st.name}
                    </h3>

                    <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                      {st.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {st.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-surface-muted text-content-secondary font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <span className="font-semibold text-content-primary">
                      {st.count} Exercises
                    </span>
                    <a
                      href={`https://www.w3resource.com/sql-exercises/${st.slug}.php`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-accent-500 hover:underline font-semibold"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Track & Module Categorized Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Track Navigation */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-content-subtle px-1">
                Curriculum Tracks (6 Core Sections)
              </h2>

              <div className="space-y-2">
                {W3RESOURCE_MASTER_CATALOG.map((track) => {
                  const isSelected = selectedTrackId === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setSelectedTrackId(track.id);
                        setSelectedSubtrackId(track.subtracks[0].id);
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-surface border-accent-500 shadow-e1 ring-1 ring-accent-500/30'
                          : 'bg-surface border-border-default hover:border-border-hover'
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-surface-muted border border-border-subtle">
                        {getTrackIcon(track.iconName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-accent-500' : 'text-content-primary'
                            }`}
                          >
                            {track.name}
                          </h3>
                          <span className="text-[11px] font-semibold text-content-subtle whitespace-nowrap">
                            {track.totalExercises} ex
                          </span>
                        </div>
                        <p className="text-[11px] text-content-secondary line-clamp-1 mt-0.5">
                          {track.description}
                        </p>
                        <p className="text-[10px] text-content-subtle mt-1.5 font-medium">
                          {track.subtracks.length} Specialized Subtracks
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Subtracks & Question Blueprints */}
            <div className="lg:col-span-8 space-y-6">
              {/* Subtrack Selector Tabs */}
              <div className="bg-surface border border-border-default rounded-xl p-4 shadow-e1 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div>
                    <h3 className="text-sm font-bold text-content-primary flex items-center gap-2">
                      {getTrackIcon(selectedTrack.iconName)}
                      <span>{selectedTrack.name} Modules</span>
                    </h3>
                    <p className="text-xs text-content-secondary mt-0.5">
                      {selectedTrack.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-accent-500 px-2.5 py-1 rounded bg-accent-500/10">
                    {selectedTrack.totalExercises} Exercises Total
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedTrack.subtracks.map((st) => {
                    const isSubSelected = selectedSubtrackId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedSubtrackId(st.id)}
                        className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSubSelected
                            ? 'bg-accent-500/10 border-accent-500 font-semibold'
                            : 'bg-surface-muted border-border-default hover:border-border-hover'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`truncate ${
                              isSubSelected ? 'text-accent-500' : 'text-content-primary'
                            }`}
                          >
                            {st.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyBadge(
                              st.difficulty
                            )}`}
                          >
                            {st.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-content-secondary">
                          <span>{st.count} Exercises</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSubSelected ? 'translate-x-1 text-accent-500' : 'text-content-subtle'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtrack Detail Card */}
              {currentSubtrack && (
                <div className="bg-surface border border-border-default rounded-xl p-5 shadow-e1 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-content-primary">
                          {currentSubtrack.name}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                            currentSubtrack.difficulty
                          )}`}
                        >
                          {currentSubtrack.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-content-secondary leading-relaxed">
                        {currentSubtrack.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.w3resource.com/sql-exercises/${currentSubtrack.slug}.php`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-muted hover:bg-border-default text-content-primary border border-border-default transition-colors"
                      >
                        <span>w3resource Web Page</span>
                        <ExternalLink className="w-3 h-3 text-content-secondary" />
                      </a>
                    </div>
                  </div>

                  {/* Core Tags / SQL Keywords */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-subtle">
                      Core Operations & Keywords Tested
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSubtrack.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-surface-muted border border-border-subtle text-accent-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample Query Blueprint */}
                  {currentSubtrack.sampleQuestions && currentSubtrack.sampleQuestions.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-subtle flex items-center justify-between">
                        <span>Representative Question & Canonical Query Blueprint</span>
                        <span className="text-[10px] text-content-secondary lowercase">
                          {currentSubtrack.count} exercises available in this track
                        </span>
                      </h5>

                      <div className="space-y-3">
                        {currentSubtrack.sampleQuestions.map((sq, idx) => (
                          <div
                            key={idx}
                            className="bg-canvas border border-border-default rounded-lg p-4 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <h6 className="text-xs font-bold text-content-primary">
                                {idx + 1}. {sq.title}
                              </h6>
                              <span className="text-[10px] font-medium text-success-500 bg-success-500/10 px-2 py-0.5 rounded border border-success-500/20">
                                Verified Canonical Pattern
                              </span>
                            </div>
                            <p className="text-xs text-content-secondary">
                              {sq.description}
                            </p>
                            <pre className="p-3 rounded bg-surface border border-border-subtle text-[11px] font-mono text-content-primary overflow-x-auto leading-relaxed">
                              {sq.sampleSql}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Footer */}
                  <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-content-secondary">
                      Ready to write and execute queries against live datasets?
                    </p>
                    {onNavigateToPractice && (
                      <button
                        onClick={onNavigateToPractice}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-500 hover:text-accent-400 cursor-pointer"
                      >
                        <span>Open Interactive Practice Arena</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
