import React from 'react';
import { Home, Code2, BarChart2, Bookmark, Settings, Rocket, ArrowRight, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50';
  setActiveView: (view: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50') => void;
  onOpenUpgradeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenUpgradeModal,
}) => {
  return (
    <aside className="w-20 shrink-0 hidden lg:flex flex-col items-center justify-between py-6 px-2 bg-[#060c18] border-r border-slate-800/80 min-h-[calc(100vh-4rem)] select-none">
      {/* Top Nav Rail Icons */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Dashboard / Home */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
            activeView === 'dashboard'
              ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Home Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Course / Active Lesson */}
        <button
          onClick={() => setActiveView('course')}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
            activeView === 'course'
              ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Active Lesson & Modules"
        >
          <Home className="w-5 h-5" />
          <span>Lesson</span>
        </button>

        {/* Practice (Interview 50 & Practice Arena) */}
        <button
          onClick={() => setActiveView('interview50')}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
            activeView === 'interview50'
              ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="SQL Practice Challenges"
        >
          <Code2 className="w-5 h-5" />
          <span>Practice</span>
        </button>

        {/* Progress / Roadmap */}
        <button
          onClick={() => setActiveView('roadmap')}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
            activeView === 'roadmap'
              ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Progress & Curriculum Roadmap"
        >
          <BarChart2 className="w-5 h-5" />
          <span>Progress</span>
        </button>

        {/* Bookmarks / Notes */}
        <button
          onClick={() => setActiveView('notes')}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
            activeView === 'notes'
              ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Bookmarks & Saved Notes"
        >
          <Bookmark className="w-5 h-5" />
          <span>Bookmarks</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            alert('Settings: In-browser WebAssembly SQLite engine is active. Progress is saved locally.');
          }}
          className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Bottom Promo: Learn SQL Faster! Upgrade -> */}
      <div className="w-full px-1">
        <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-2.5 flex flex-col items-center text-center space-y-1.5 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-base">
            🚀
          </div>
          <span className="text-[10px] font-bold text-slate-200 leading-tight">
            Learn SQL<br />Faster!
          </span>
          <button
            onClick={() => {
              if (onOpenUpgradeModal) onOpenUpgradeModal();
              else alert('Pro features unlocked! All 50 LeetCode interview challenges and custom modules are accessible.');
            }}
            className="w-full py-1 px-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-0.5 shadow-md cursor-pointer transition"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
