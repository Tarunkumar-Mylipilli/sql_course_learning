import React from 'react';
import { Database, Flame, CheckCircle2, PlusCircle, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
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
  const progressPercent = Math.round((completedTopicsCount / Math.max((topics || []).length, 1)) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                SQLMastery
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Course Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive Video • Theory • Quiz • Coding Playground
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 px-4 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Progress:</span>
            <span className="text-sky-400 font-bold">
              {completedTopicsCount}/{topics.length} Modules
            </span>
          </div>
          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">{progressPercent}%</span>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold" title="Daily Learning Streak">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{progress.streakDays || 1}d Streak</span>
          </div>

          {/* AI Tutor Assistant Button */}
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-medium transition cursor-pointer"
            title="Open AI SQL Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('course')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'course'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setActiveView('roadmap')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'roadmap'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveView('interview50')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeView === 'interview50'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Interview 50</span>
            </button>
            <button
              onClick={() => setActiveView('notes')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeView === 'notes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-indigo-300'
              }`}
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>Notes Hub</span>
            </button>
          </div>

          {/* Add New Topic Option */}
          <button
            onClick={onOpenAddTopic}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm cursor-pointer"
            title="Add your own custom SQL topic"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Topic</span>
          </button>

          {/* Reset progress button */}
          <button
            onClick={onResetProgress}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Reset course progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
