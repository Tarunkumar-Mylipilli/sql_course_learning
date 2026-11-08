import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { AuthUser } from '../lib/auth';

interface AppShellProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50';
  setActiveView: (view: 'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50') => void;
  onOpenAITutor: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  streakDays?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeView,
  setActiveView,
  onOpenAITutor,
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  streakDays = 1,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-col font-ui antialiased">
      {/* Skip to main content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-md focus:shadow-e2"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <TopBar
        onToggleSidebar={() => setIsMobileMenuOpen((prev) => !prev)}
        activeView={activeView}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        currentUser={currentUser}
        onLogout={onLogout}
        streakDays={streakDays}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAITutor={onOpenAITutor}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Central Content Canvas */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-20 lg:pb-8 outline-none"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Rail */}
      <MobileNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};
