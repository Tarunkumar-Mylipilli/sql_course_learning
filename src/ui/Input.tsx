import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full space-y-1.5 font-ui">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-content-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-content-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full bg-surface text-content-primary placeholder:text-content-subtle border rounded-md px-3 py-2 text-base sm:text-sm font-ui transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:border-transparent ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error
                ? 'border-feedback-error-border focus-visible:ring-feedback-error-fg'
                : 'border-border-default hover:border-border-strong'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-content-muted pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-xs text-feedback-error-fg font-medium">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-content-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
