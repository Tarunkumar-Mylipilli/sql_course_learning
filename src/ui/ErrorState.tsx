import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Execution Error',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-4 rounded-xl bg-feedback-error-bg border border-feedback-error-border text-feedback-error-fg space-y-2 font-ui ${className}`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <h5 className="text-xs font-bold">{title}</h5>
      </div>
      <p className="text-xs font-code opacity-90 leading-relaxed whitespace-pre-wrap">
        {message}
      </p>
      {onRetry && (
        <div className="pt-1">
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Query
          </Button>
        </div>
      )}
    </div>
  );
};
