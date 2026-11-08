import React from 'react';

export interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; badge?: string | number }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 p-1 bg-surface border border-border-default rounded-lg font-ui overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-500 cursor-pointer ${
              isSelected
                ? 'bg-elevated text-content-primary shadow-e1'
                : 'text-content-secondary hover:text-content-primary hover:bg-elevated/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-border-subtle text-content-muted">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
