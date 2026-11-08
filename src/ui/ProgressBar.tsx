import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full space-y-1.5 font-ui ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold text-content-secondary">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-border-subtle rounded-full overflow-hidden border border-border-default/50">
        <div
          className="h-full bg-accent-600 transition-all duration-300 rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
