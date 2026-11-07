import React from 'react';
import { Database, Flame, Plus, Sparkles, BookOpen } from 'lucide-react';
import { CourseProgress, Topic } from '../types';

interface NavbarProps {
  topics: Topic[];
  progress: CourseProgress;
  activeView: 'course' | 'roadmap' | 'notes' | 'interview50';
  setActiveView: (view: 'course' | 'roadmap' | 'notes' | 'interview50') => void;
  onOpenAddTopic: () => void;
  onResetProgress: () => void;
  onOpenAITutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  topics,
  progress,
  activeView,
  setActiveView,
  onOpenAddTopic,
  onResetProgress,
  onOpenAITutor,
}) => {
  const completedTopicsCount = (topics || []).filter(
    (t) => t && progress?.topics && progress.topics[t.id]?.codingCompleted
  ).length;
  const totalTopics = Math.max((topics || []).length, 14);
  const progressPercent = Math.round((completedTopicsCount / totalTopics) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#070d19]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Main Nav Items */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo / Brand */}
          <div
            onClick={() => setActiveView('course')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* Database Stack Icon */}
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center text-xl font-extrabold tracking-tight">
              <span className="text-white">SQL</span>
              <span className="text-cyan-400">Mastery</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* Learn */}
            <button
              onClick={() => setActiveView('course')}
              className={`relative py-1 font-medium transition cursor-pointer ${
                activeView === 'course' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Learn</span>
              {activeView === 'course' && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>

            {/* Curriculum */}
            <button
              onClick={() => setActiveView('roadmap')}
              className={`relative py-1 font-medium transition cursor-pointer ${
                activeView === 'roadmap' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Curriculum</span>
              {activeView === 'roadmap' && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>

            {/* Interview 50 */}
            <button
              onClick={() => setActiveView('interview50')}
              className={`relative py-1 font-medium transition cursor-pointer ${
                activeView === 'interview50' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Interview 50</span>
              {activeView === 'interview50' && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>

            {/* Notes Hub */}
            <button
              onClick={() => setActiveView('notes')}
              className={`relative py-1 font-medium transition cursor-pointer ${
                activeView === 'notes' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Notes Hub</span>
              {activeView === 'notes' && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>

            {/* Add Topic Pill */}
            <button
              onClick={onOpenAddTopic}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>Add Topic</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Progress Pill, Streak, AI Tutor, User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Progress Pill: e.g. "0/14 Modules (0%)" */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1220] border border-slate-800 text-xs text-slate-300">
            {/* Circular meter */}
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  className="stroke-slate-800"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  className="stroke-cyan-400"
                  strokeWidth="3"
                  strokeDasharray={56.5}
                  strokeDashoffset={56.5 - (56.5 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-medium text-slate-300">
              {completedTopicsCount}/{totalTopics} Modules ({progressPercent}%)
            </span>
          </div>

          {/* Streak Badge: 🔥 1d Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{progress.streakDays || 1}d Streak</span>
          </div>

          {/* AI Tutor Button */}
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)] transition cursor-pointer"
            title="Open Socratic AI SQL Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Tutor</span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative group cursor-pointer" onClick={onResetProgress} title="Click to manage profile or reset">
            <div className="w-8 h-8 rounded-full ring-2 ring-slate-800 overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute">TM</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
