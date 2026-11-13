import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Route,
  FileText,
  Briefcase,
  Database,
  Library,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50' | 'practice' | 'w3catalog';
  setActiveView: (view: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50' | 'practice' | 'w3catalog') => void;
  onOpenAITutor: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenAITutor,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'course',
      label: 'Learning Path',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: <Route className="w-4 h-4" />,
    },
    {
      id: 'notes',
      label: 'SQL Cheat Sheet',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'interview50',
      label: 'FAANG 50 Practice',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'practice',
      label: 'SQL Practice Arena',
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'w3catalog',
      label: 'W3Resource Catalog',
      icon: <Library className="w-4 h-4" />,
    },
  ] as const;

  const content = (
    <aside className="w-60 h-full bg-surface border-r border-border-default flex flex-col justify-between p-3 font-ui select-none">
      <div className="space-y-4">
        <div className="px-3 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-content-subtle">
            Curriculum
          </p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-500 cursor-pointer ${
                  isActive
                    ? 'bg-surface text-content-primary border-l-2 border-accent-500 font-bold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface/50 border-l-2 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pt-4 border-t border-border-default">
        <button
          onClick={() => {
            onOpenAITutor();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-bold bg-accent-600 hover:bg-accent-700 text-white shadow-e1 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Socratic AI</span>
        </button>

        <a
          href="./admin.html"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-content-muted hover:text-content-primary hover:bg-elevated transition cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Admin Studio</span>
        </a>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-e3 animate-slideIn">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
