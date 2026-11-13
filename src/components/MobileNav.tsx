import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Route,
  FileText,
  Briefcase,
  Database,
} from 'lucide-react';

interface MobileNavProps {
  activeView: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50' | 'practice' | 'w3catalog';
  setActiveView: (view: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50' | 'practice' | 'w3catalog') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  setActiveView,
}) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'course', label: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'practice', label: 'Arena', icon: <Database className="w-5 h-5" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Route className="w-5 h-5" /> },
    { id: 'interview50', label: 'FAANG', icon: <Briefcase className="w-5 h-5" /> },
  ] as const;

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-surface/95 backdrop-blur-md border-t border-border-default flex items-center justify-around px-2 font-ui select-none safe-area-bottom"
    >
      {items.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] transition-colors outline-none cursor-pointer ${
              isActive
                ? 'text-accent-600 dark:text-accent-400 font-bold'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
