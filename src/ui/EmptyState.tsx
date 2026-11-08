import React from 'react';
import { Database } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border-default rounded-xl space-y-3 font-ui ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-950 flex items-center justify-center text-accent-600 dark:text-accent-400">
        {icon || <Database className="w-6 h-6" />}
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-bold text-content-primary">{title}</h4>
        <p className="text-xs text-content-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
