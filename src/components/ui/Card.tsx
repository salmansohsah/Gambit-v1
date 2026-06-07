import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function Card({ children, interactive = false, className = '', ...props }: CardProps) {
  const baseClasses = "bg-surface-card border border-surface-elevated p-8 flex flex-col rounded-[var(--radius-card)] transition-colors duration-300";
  const interactiveClasses = interactive ? "hover:border-accent-gold cursor-pointer" : "";

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
