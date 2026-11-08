import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { AuthUser } from '../lib/auth';

interface TopBarProps {
  onToggleSidebar: () => void;
  activeView: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  streakDays?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  activeView,
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  streakDays = 1,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sqlmastery_theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sqlmastery_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-surface/90 backdrop-blur-md border-b border-border-default px-4 sm:px-6 flex items-center justify-between gap-3 font-ui select-none">
      <div className="flex items-center gap-3">
        <IconButton
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label="Toggle navigation menu"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5 text-content-primary" />
        </IconButton>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-600 text-white flex items-center justify-center shadow-e1">
            <Database className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm sm:text-base text-content-primary tracking-tight">
            SQLMastery
          </span>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SQL topics, clauses, exercises..."
            className="w-full bg-canvas text-content-primary placeholder:text-content-subtle border border-border-default rounded-md pl-9 pr-3 py-1.5 text-xs font-ui outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border-default text-xs font-semibold text-content-primary">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{streakDays}d</span>
        </div>

        {/* Theme Toggle */}
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-content-secondary" />
          )}
        </IconButton>

        {/* User Account / Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-border-default">
            <span className="text-xs font-bold text-content-secondary hidden md:inline">
              {currentUser.username}
            </span>
            {onLogout && (
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Log out"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 text-feedback-error-fg" />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
