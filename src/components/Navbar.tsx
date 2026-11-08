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
  LayoutDashboard,
} from 'lucide-react';
import { CourseProgress, Topic } from '../types';
import { AuthUser } from '../lib/auth';
import { LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  topics: Topic[];
  progress: CourseProgress;
  activeView: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50';
  setActiveView: (view: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50') => void;
  onOpenAddTopic: () => void;
  onResetProgress: () => void;
  onOpenAITutor: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
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
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-slate-800/80 select-none">
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
          <a
            href="./admin.html"
            onClick={(e) => {
              // Allows direct navigation to admin.html
            }}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-950/90 text-blue-400 border border-blue-500/30 uppercase tracking-wider hover:bg-blue-900/60 hover:text-blue-300 transition"
            title="Open SQLMastery Admin Dashboard & CMS"
          >
            ADMIN
          </a>
        </div>

        {/* Center: Top Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

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
            <span>Lessons</span>
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
              className="w-full bg-canvas border border-slate-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
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
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1 right-1 shadow-e1" />
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300"
              title={`Logged in as ${currentUser?.username || 'Tarunkumar'}`}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser?.username?.[0] || 'T'}
              </div>
              <span className="font-semibold text-slate-200 hidden sm:inline">
                {currentUser?.username || 'Tarunkumar'}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
