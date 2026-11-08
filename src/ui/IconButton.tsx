import React, { forwardRef } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-ui transition-all duration-200 cursor-pointer select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed';

    // Min 44x44px touch targets on mobile
    const sizeStyles = {
      sm: 'w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px]',
      md: 'w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px]',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    };

    const variantStyles = {
      primary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-e1',
      secondary:
        'bg-surface text-content-primary border border-border-default hover:bg-elevated hover:border-border-strong',
      ghost:
        'bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface active:bg-elevated',
      danger:
        'bg-feedback-error-bg text-feedback-error-fg border border-feedback-error-border hover:bg-red-600 hover:text-white',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
