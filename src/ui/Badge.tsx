import React from 'react';

export interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-surface text-content-secondary border border-border-default',
    accent: 'bg-accent-50 text-accent-700 border border-accent-200 dark:bg-accent-950 dark:text-accent-300 dark:border-accent-800',
    success: 'bg-feedback-success-bg text-feedback-success-fg border border-feedback-success-border',
    warning: 'bg-feedback-warning-bg text-feedback-warning-fg border border-feedback-warning-border',
    error: 'bg-feedback-error-bg text-feedback-error-fg border border-feedback-error-border',
    info: 'bg-feedback-info-bg text-feedback-info-fg border border-feedback-info-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-ui ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
