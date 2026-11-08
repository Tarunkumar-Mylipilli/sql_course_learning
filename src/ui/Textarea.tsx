import React, { forwardRef, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="w-full space-y-1.5 font-ui">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-content-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full bg-surface text-content-primary placeholder:text-content-subtle border rounded-md p-3 text-base sm:text-sm font-code transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
            error
              ? 'border-feedback-error-border focus-visible:ring-feedback-error-fg'
              : 'border-border-default hover:border-border-strong'
          } ${className}`}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
