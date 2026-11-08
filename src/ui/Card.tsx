import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'interactive' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  variant = 'base',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    base: 'bg-surface border border-border-default shadow-e1',
    interactive:
      'bg-surface border border-border-default hover:border-accent-500 hover:bg-elevated transition-all cursor-pointer shadow-e1 hover:shadow-e2',
    elevated: 'bg-elevated border border-border-subtle shadow-e2',
  };

  return (
    <div
      className={`rounded-xl p-5 font-ui transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
