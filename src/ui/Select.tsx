import React, { forwardRef, useId } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, children, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 font-ui">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-content-secondary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-surface text-content-primary border rounded-md px-3 py-2 text-sm font-ui transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
            error
              ? 'border-feedback-error-border'
              : 'border-border-default hover:border-border-strong'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="text-xs text-feedback-error-fg font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-content-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
