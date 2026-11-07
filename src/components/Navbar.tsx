import React from 'react';
import {
  Database,
  Home,
  BookOpen,
  Briefcase,
  FileText,
  Plus,
  Search,
  Crown,
  Bell,
} from 'lucide-react';
import { CourseProgress, Topic } from '../types';

interface NavbarProps {
  topics: Topic[];
  progress: CourseProgress;
  activeView: 'course' | 'roadmap' | 'notes' | 'interview50';
  setActiveView: (view: 'course' | 'roadmap' | 'notes' | 'interview50') => void;
  onOpenAddTopic: () => void;
  onResetProgress: () => void;
  onOpenAITutor: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  topics,
  progress,
  activeView,
  setActiveView,
  onOpenAddTopic,
  onResetProgress,
  onOpenAITutor,
  searchQuery = '',
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070d19]/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div
          onClick={() => setActiveView('course')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center text-xl font-extrabold tracking-tight">
            <span className="text-white">SQL</span>
            <span className="text-cyan-400">Mastery</span>
          </div>
        </div>

        {/* Center: Top Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Learn */}
          <button
            onClick={() => setActiveView('course')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'course'
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>

          {/* Curriculum */}
          <button
            onClick={() => setActiveView('roadmap')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'roadmap'
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum</span>
          </button>

          {/* Interview */}
          <button
            onClick={() => setActiveView('interview50')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'interview50'
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Interview</span>
          </button>

          {/* Notes */}
          <button
            onClick={() => setActiveView('notes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'notes'
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          {/* + Add Topic */}
          <button
            onClick={onOpenAddTopic}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Create or customize course modules"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>Add Topic</span>
          </button>
        </nav>

        {/* Right: Search, Go Pro, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Bar */}
          <div className="relative hidden xl:block w-44">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full bg-[#0b1220] border border-slate-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Go Pro Badge */}
          <button
            onClick={() =>
              alert('Pro status is active! You have full access to all 50 LeetCode interview challenges and custom module generation.')
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Go Pro</span>
          </button>

          {/* Notification Bell */}
          <div className="relative p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 cursor-pointer transition">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1 right-1 shadow-[0_0_6px_#22d3ee]" />
          </div>

          {/* User Profile Avatar */}
          <div
            onClick={onResetProgress}
            className="w-8 h-8 rounded-full ring-2 ring-slate-800 overflow-hidden bg-slate-800 flex items-center justify-center cursor-pointer hover:ring-cyan-500/50 transition"
            title="User Profile (click to reset course data if needed)"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
